import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '../context/auth';
import Layout from '../components/AppLayout';
import NavBar from '../components/NavBar';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated]);

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto focus:outline-none py-6" tabIndex="0">
        <div className="max-w-5xl mx-auto bg-gray-100 p-8">
          <h1 className="text-3xl">SourceCheck Verified Profile</h1>
          <p className="my-4">This simple interface is designed to walk you through the simple steps to create a payment address on the Polygon network.</p>

          <div className="flex flex-row space-x-3 my-3">
            <div className="text-lg font-bold">
              <div className="inline-block bg-white rounded-full px-2 pt-1 h-8 w-8 text-center">1</div>
            </div>
            <div>
              <span>
                Install MetaMask in your browser and generate a new, unique payment address.<br/>  
                Re-using an existing address is <span className="font-bold">strongly discouraged</span>, as all previous payment history will be exposed and tied to this new payment address.
              </span>
              
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div className="text-lg font-bold">
              <div className="inline-block bg-white rounded-full px-2 pt-1 h-8 w-8 text-center">2</div>
            </div>
            <div>
              <span>Reload this page and click the <span className="font-semi-bold">Connect Wallet</span> button in the upper right once you have a MetaMask configured with a new address.</span>
              <br/>
              <span className="inline-block mt-2">
                <span className="font-bold">Note:</span> if you have never connected to the Polygon network, you may need to configure MetaMask additionally and send 50c worth of Polygon tokens to the new address you have created.
              </span>
              
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div className="text-lg font-bold">
              <div className="inline-block bg-white rounded-full px-2 pt-1 h-8 w-8 text-center">3</div>
            </div>
            <div>
              <span>
                Once your wallet is connected, follow the instructions to create and "deploy" (publish) your profile.<br/>
                This profile will be hosted by the SourceCheck.org co-operative, but can be deleted or migrated to a new home at any time.
              </span>
            </div>
          </div>
          <div className="flex flex-row space-x-3 my-3">
            <div className="text-lg font-bold">
              <div className="inline-block bg-white rounded-full px-2 pt-1 h-8 w-8 text-center">4</div>
            </div>
            <div>
              <span>
                Once you have published your profile, we will give you a unique URL that you can use as your "homepage" on social networks.<br/>
                 You will also receive a payment address usable on the Polygon Network. <br/>
                 Both of these are yours to use as you will, and can be included securely in PDF publications using the <a className="text-indigo-500 hover:text-indigo-600" href="https://honorbox.app" target="_blank">HonorBox application</a>, 
                 also created by the <a className="text-indigo-500 hover:text-indigo-600" href="https://sourcecheck.org" target="_blank">SourceCheck co-operative</a>.
              </span>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
