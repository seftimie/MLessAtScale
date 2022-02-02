# MLessAtScale
Google Cloud Easy as Pie Serverless Hackathon

Deploying & testing our solution via Pipeline via GCP Cloud Shell

- **GCP Project Setup**: Open https://console.cloud.google.com, choose your project and activate this services: cloud build, cloud run, bigquery via "Cloud Shell":
  
  ```
  #enable missing services with: 
  gcloud services enable cloudbuild.googleapis.com run.googleapis.com bigquery.googleapis.com
  
  #check if this services are available with:
  gcloud services list --enabled
  ```

- **GCP Permissions**:
  - On Cloud Build  > Settings : Enable Cloud Run and Service Accounts (!);
  - On IAM > Cloud Build service account (<gcp_project_number>@cloudbuild.gserviceaccount.com) shoud have this permissions: BigQuery Admin, Cloud Build Service Account, Cloud Run Admin, Service Account User, Storage Object Creator;

- **Clone repo code**: back into GCP, "Cloud Shell" run:
  ```
  git clone https://github.com/seftimie/MLessAtScale.git
  cd MLessAtScale/pipeline/
  ```
		
- **Set variables**: still into GCP, "Cloud Shell" run:
  
  ```
  #must change:
  GCP_PROJECT_ID="plated-howl-340116"
  BQ_DATASET_ID="easyserverless"
  BQ_LOCATION="US"
  BQ_MODEL="model1"
  RUN_LOCATION="europe-west1"

  #don't change:
  BQ_QUERY="https://storage.googleapis.com/easyserverless-assets/model.sql"
  DOCKERFILE_ML="https://storage.googleapis.com/easyserverless-assets/Dockerfile_ML"
  BQ_FORMAT="ML_TF_SAVED_MODEL"
  RUN_NAME="${BQ_MODEL}-run"
  GCP_BUCKET="gs://${GCP_PROJECT_ID}-assets/models/${BQ_MODEL}"
  ```
  **note**: if you want/have a custom bqml model for creating and training the model, you can change BQ_QUERY value with a public file. Our current BQML is inspired by Predict Visitor Purchases with a Classification Model in BQML (Improve model performance with Feature Engineering)  https://www.qwiklabs.com/focuses/1794?parent=catalog 

- **Deploy MLess**: if already have created this resources, just skip this part:
	
  ```
  #create gcp bucket
  gsutil mb -p $GCP_PROJECT_ID -c STANDARD -l $RUN_LOCATION -b on "gs://${GCP_PROJECT_ID}-assets/" 
  
  #create bigquery dataset
  bq --project_id=$GCP_PROJECT_ID --location=$BQ_LOCATION mk -d $BQ_DATASET_ID
  
  #deploy MLess
  gcloud builds submit --no-source --substitutions _GCP_PROJECT_ID=$GCP_PROJECT_ID,_GCP_BUCKET=$GCP_BUCKET,_BQ_QUERY=$BQ_QUERY,_BQ_DATASET_ID=$BQ_DATASET_ID,_BQ_MODEL=$BQ_MODEL,_BQ_LOCATION=$BQ_LOCATION,_BQ_FORMAT=$BQ_FORMAT,_RUN_LOCATION=$RUN_LOCATION,_RUN_NAME=$RUN_NAME,_DOCKERFILE_ML=$DOCKERFILE_ML
  ```
  note: You can go to Cloud Build to check all logs of the process. 

- **Predict with MLess**: when done, check the deployment in Cloud Run and make a predict with:
  ```
  # to find out the payload of your model, just hit this:
  curl -d '{"instances":[{}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  # demo predict:
  curl -d '{"instances":[{"bounces":0,"channelGrouping":"Referral","country":"United States","deviceCategory":"desktop","latest_ecommerce_progress":6,"medium":"referral","pageviews":51,"source":"mall.googleplex.com","time_on_site":4245}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  ```


## GCP Cloud Run web App:
