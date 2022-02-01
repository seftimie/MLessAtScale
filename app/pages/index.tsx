import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import FormBox from '../components/FormBox'

import bq from '../public/icons/bq.svg'
import gcp from '../public/icons/gcp.svg'
import gcr from '../public/icons/cloud_run.svg'
import iam from '../public/icons/iam.svg'

import pipeline from '../../assets/pipeline.png'
import InputWithLabel from '../components/InputWithLabel'


const Home: NextPage = () => {
  const [formData, setFormData] = useState({
    bq: {}
  })

  return (
    <div className='min-h-screen bg-slate-100 relative'>
      <Head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>" />
        <title>MLess @ Scale</title>
      </Head>
      {/* <div className='absolute top-0 left-0'> */}
      {/* <Image src={pipeline} width={480} height={750} alt='' /> */}
      {/* </div> */}
      <main className='py-8 m-auto max-w-screen-lg space-y-12'>
        <FormBox icon={gcp}>
          <div className='flex justify-center w-full'>
            <div className='flex space-x-8 justify-around'>
              <InputWithLabel id="project_id" label="Project ID" placeholder="my-cool-project" />
              <InputWithLabel id="bucket" label="Bucket" placeholder="Bucket name" />
            </div>
          </div>
        </FormBox>
        <FormBox icon={bq}>
          <div className='flex space-x-8 justify-around'>
            <InputWithLabel id="bq_dataset" label="BQ Dataset" />
            <InputWithLabel id="bq_model" label="BQ Model" />
            <InputWithLabel id="bq_location" label="BQ Location" />
            <InputWithLabel id="bq_formar" label="BQ Format" />
          </div>
        </FormBox>
        <FormBox icon={gcr}>
          <div className='flex justify-center w-full'>
            <div className='flex space-x-8 justify-around'>
              <InputWithLabel id="run_location" label="Cloud Run Location" placeholder="my-cool-project" />
              <InputWithLabel id="run_name" label="Cloud Run Name" placeholder="Bucket name" />
            </div>
          </div>
        </FormBox>
        {/* <FormBox icon={iam}>
          <div className='flex space-x-8'>
            <InputWithLabel id="sa_email" label="Service Account Email" placeholder="service.account@gcloud.com" />
            <div>
              <label htmlFor="sa_json" className="block text-sm font-medium text-slate-700">
                Service Account JSON
              </label>
              <div className="mt-1">
                <input
                  type="sa_json"
                  name="sa_json"
                  id="sa_json"
                  className="shadow-md shadow-slate-300 bg-slate-50 focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md outline-none px-3 py-2"
                  placeholder="{...}"
                />
              </div>
            </div>
          </div>
        </FormBox> */}
        <div className="flex justify-center">
          <div>
            <button className="bg-indigo-500 shadow-lg shadow-indigo-200 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
