# MLessAtScale
Google Cloud Easy as Pie Serverless Hackathon

Deploy on GCP with Cloud Shell and Next.JS web app:

[![MLess at Scale Video](https://raw.githubusercontent.com/seftimie/MLessAtScale/09a42e6655c05c4cb0801f1d628e55bb32db9eb8/assets/video.png)](https://www.youtube.com/watch?v=FFdn7fN84mU)


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
  RUN_NAME="mless-front"
  BQ_LOCATION=US
  BQ_DATASET_ID=easyserverless

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
  Project ID: <project_cloud_id>
  Bucket: gs://<project_cloud_id>-assets/model1
  BQ Location: US
  ```
  
  When ready hit "View YAML" and then "Deploy". You can see in Cloud Build that the deploying of our solutions is running. 
  
- **Predict with MLess**: when done, check the deployment in Cloud Run (you should have two instances), copy the endpoint and make a predict with:
  ```
  # to find out the payload of your model, just hit this:
  curl -d '{"instances":[{}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  # demo predict:
  curl -d '{"instances":[{"bounces":0,"channelGrouping":"Referral","country":"United States","deviceCategory":"desktop","latest_ecommerce_progress":6,"medium":"referral","pageviews":51,"source":"mall.googleplex.com","time_on_site":4245}]}' -X POST https://<cloud-run-url>.a.run.app/v1/models/model:predict
  ```

  
	
 
