import { CloudBuildClient } from "@google-cloud/cloudbuild";

const cb = new CloudBuildClient();

cb.createBuild({
  projectId: "my-project",
  build: {
    projectId: "my-project",
    name: "MLess at Scale",
    steps: [
      {
        id: "Download assets",
        name: "gcr.io/cloud-builders/wget",
        entrypoint: "/bin/bash",
        args: [
          "-c",
          "cd /workspace/ && wget -O Dockerfile ${_DOCKERFILE_ML} && wget -O model.sql ${_BQ_QUERY}",
        ],
      },
      {
        id: "Create and traing the BQML model",
        name: "gcr.io/cloud-builders/gcloud",
        entrypoint: "/bin/bash",
        args: [
          "-c",
          "cd /workspace/ && cat model.sql | bq query --use_legacy_sql=false --project_id=${_GCP_PROJECT_ID}",
        ],
      },
      {
        id: "Export BQML to Google Storage",
        name: "gcr.io/cloud-builders/gcloud",
        entrypoint: "/bin/bash",
        args: [
          "-c",
          "bq --location=${_BQ_LOCATION} extract --destination_format ${_BQ_FORMAT}  --model ${_GCP_PROJECT_ID}:${_BQ_DATASET_ID}.${_BQ_MODEL} ${_GCP_BUCKET}",
        ],
      },
      {
        id: "Deploy BQML into Cloud Run",
        name: "gcr.io/cloud-builders/gcloud",
        entrypoint: "/bin/bash",
        args: [
          "-c",
          "cd /workspace/ && mkdir -p /workspace/models/tf_models/model/00000001/ && gsutil cp -r ${_GCP_BUCKET}/* /workspace/models/tf_models/model/00000001/ && gcloud builds submit --project=${_GCP_PROJECT_ID} --tag gcr.io/${_GCP_PROJECT_ID}/${_RUN_NAME} && gcloud run deploy ${_RUN_NAME} --project=${_GCP_PROJECT_ID} --image gcr.io/${_GCP_PROJECT_ID}/${_RUN_NAME} --platform managed --region ${_RUN_LOCATION} --allow-unauthenticated && gcloud run services add-iam-policy-binding ${_RUN_NAME} --project=${_GCP_PROJECT_ID} --region ${_RUN_LOCATION} --member='allUsers' --role='roles/run.invoker'",
        ],
      },
    ],
    substitutions: {
      _BQ_DATASET_ID: "my-dataset",
      _BQ_FORMAT: "CSV",
      _BQ_LOCATION: "us-central1",
      _BQ_MODEL: "my-model",
      _BQ_QUERY: "gs://my-bucket/model.sql",
      _GCP_BUCKET: "my-bucket",
      _GCP_PROJECT_ID: "my-project",
      _RUN_NAME: "my-run",
      _RUN_LOCATION: "us-central1",
    },
  },
});
