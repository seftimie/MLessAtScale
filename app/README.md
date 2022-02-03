# MLessAtScale
Google Cloud Easy as Pie Serverless Hackathon

Deploy on GCP with Cloud Shell and Next.JS web app:

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
  cd MLessAtScale/app/
  ```
		
- **Set variables**: on GCP "Cloud Shell" run:
  ```
  GCP_PROJECT_ID="<gcp_project_id>"
  RUN_LOCATION="europe-west1"
  RUN_NAME="MLessAtScaleFront"

  #create gcp bucket - skip this part, if already have created;
  gsutil mb -p $GCP_PROJECT_ID -c STANDARD -l $RUN_LOCATION -b on "gs://${GCP_PROJECT_ID}-assets/" 

  #create bigquery dataset - skip this part, if already have created;
  bq --project_id=$GCP_PROJECT_ID --location=$BQ_LOCATION mk -d $BQ_DATASET_ID
  ```

- **Deploy Next.js web app in Cloud Run**:  on GCP "Cloud Shell" run:
  ```
  gcloud builds submit --tag gcr.io/${GCP_PROJECT_ID}/${RUN_NAME} &&
  gcloud run deploy ${RUN_NAME} --project=${GCP_PROJECT_ID} --image gcr.io/${GCP_PROJECT_ID}/${RUN_NAME} --platform managed --region ${RUN_LOCATION} --allow-unauthenticated
  ```
  Open Cloud Run endpoint and fill the form with:
  ```
  #change
  Project ID: <gcp_project_id>
  Bucket: gs://<gcp_project_id>-assets/model1
  
  #don't change:
  Dockerfile: https://storage.googleapis.com/easyserverless-assets/Dockerfile_ML
  BQ Location: US
  BQ Dataset: easyserverless
  BQ Model: model1
  BQ Format: ML_TF_SAVED_MODEL
  BQ Query: https://storage.googleapis.com/easyserverless-assets/model.sql
  Run Location: europe-west1
  ```
  
  When ready hit "Generate YAML". Copy the code and on GCP "Cloud Shell" > "Open Editor" create new file with the
  name: "cloudbuild.yaml" and store paste the code from previous step. Then click on "Open Terminal" and go to location of "cloudbuild.yaml" then run:
  ```
  gcloud builds submit --no-source
  ```

  
	
 
