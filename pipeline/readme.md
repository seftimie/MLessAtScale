# MLessAtScale
Google Cloud Easy as Pie Serverless Hackathon

Deploy on GCP with Cloud Shell with this workflow/pipeline.

- **GCP Project Setup**: Open [GCP Console](https://console.cloud.google.com) , choose your project and activate this services: cloud build, cloud run, bigquery via "Cloud Shell":
  
  ```
  #you will need to enable this services: 
  gcloud services enable cloudbuild.googleapis.com run.googleapis.com bigquery.googleapis.com
  
  #check if enabled:
  gcloud services list --enabled
  ```

- **GCP Permissions**:
  - On [Cloud Build  > Settings](https://console.cloud.google.com/cloud-build/settings/service-account) : Enable Cloud Run and Service Accounts (!);
  - On [IAM](https://console.cloud.google.com/iam-admin/iam): the Cloud Build service account (eg: <gcp_project_number>@cloudbuild.gserviceaccount.com) shoud have this permissions: BigQuery Admin, Cloud Build Service Account, Cloud Run Admin, Service Account User, Storage Object Creator;

- **Clone repo code**: on GCP "Cloud Shell" run:
  ```
  git clone https://github.com/seftimie/MLessAtScale.git
  cd MLessAtScale/pipeline/
  ```
		
- **Set variables**: on GCP "Cloud Shell" run:
  
  ```
  #must change:
  GCP_PROJECT_ID="plated-howl-340116"
  BQ_DATASET_ID="easyserverless"
  BQ_LOCATION="US"
  BQ_MODEL="model1"
  RUN_LOCATION="europe-west1"
  BQ_QUERY="https://storage.googleapis.com/easyserverless-assets/model.sql"

  #don't change:
  DOCKERFILE_ML="https://storage.googleapis.com/easyserverless-assets/Dockerfile_ML"
  BQ_FORMAT="ML_TF_SAVED_MODEL"
  RUN_NAME="${BQ_MODEL}-run"
  GCP_BUCKET="gs://${GCP_PROJECT_ID}-assets/models/${BQ_MODEL}"
  ```
  **note**: BQ_QUERY, it's a public file, with the sql query that will create and train a BQML model. Is inspired by [Predict Visitor Purchases with a Classification Model in BQML (Improve model performance with Feature Engineering)](https://www.qwiklabs.com/focuses/1794?parent=catalog)

- **Deploy MLess**: skip this part, if already have created this resources:
	
  ```
  #create gcp bucket
  gsutil mb -p $GCP_PROJECT_ID -c STANDARD -l $RUN_LOCATION -b on "gs://${GCP_PROJECT_ID}-assets/" 
  
  #create bigquery dataset
  bq --project_id=$GCP_PROJECT_ID --location=$BQ_LOCATION mk -d $BQ_DATASET_ID
  
  #deploy MLess
  gcloud builds submit --no-source --substitutions _GCP_PROJECT_ID=$GCP_PROJECT_ID,_GCP_BUCKET=$GCP_BUCKET,_BQ_QUERY=$BQ_QUERY,_BQ_DATASET_ID=$BQ_DATASET_ID,_BQ_MODEL=$BQ_MODEL,_BQ_LOCATION=$BQ_LOCATION,_BQ_FORMAT=$BQ_FORMAT,_RUN_LOCATION=$RUN_LOCATION,_RUN_NAME=$RUN_NAME,_DOCKERFILE_ML=$DOCKERFILE_ML
  ```
  This process will run on [Cloud Build](https://console.cloud.google.com/cloud-build/builds) (check the logs)

- **Predict with MLess**: when done, check the deployment in Cloud Run and make a predict with:
  ```
  # to find out the payload of your model, just hit this:
  curl -d '{"instances":[{}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  # demo predict:
  curl -d '{"instances":[{"bounces":0,"channelGrouping":"Referral","country":"United States","deviceCategory":"desktop","latest_ecommerce_progress":6,"medium":"referral","pageviews":51,"source":"mall.googleplex.com","time_on_site":4245}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  ```
