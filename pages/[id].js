import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import PuffLoader from "react-spinners/PuffLoader";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import JsonModal from '../components/JsonModal';
import NotificationPanel from '../components/NotificationPanel';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const PROFILE_PATH = process.env.NEXT_PUBLIC_PROFILE_PATH;
const PROFILE_URL = `${API_HOST}${PROFILE_PATH}`;

function shortenAddr(address) {
  if (address) {
    return `${address.slice(0,6)}...${address.slice(address.length - 4)}`;
  }
}

function twitterLink(twitterHandle) {
  return <a className="text-indigo-500 hover:text-indigo-700" target="_blank" href={`https://twitter.com/${twitterHandle}`}>@{twitterHandle}</a>
}

function domainLink(domainName) {
  return <a className="text-indigo-500 hover:text-indigo-700" target="_blank" href={`https://${domainName}`}>{domainName}</a>
}

export default function VerifiedProfile() {
  const router = useRouter();
  const profileId = router.query.id;

  // Profile State
  const [profileAddr, setProfileAddr] = useState();
  const [displayName, setDisplayName] = useState();
  const [username, setUsername] = useState();
  const [twitterHandle, setTwitterHandle] = useState();
  const [twitterCred, setTwitterCred] = useState();
  const [domainName, setDomainName] = useState();
  const [domainCred, setDomainCred] = useState();
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [profileFound, setProfileFound] = useState(false);
  const [showingTwitter, setShowingTwitter] = useState(false);
  const [showingDomain, setShowingDomain] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  async function fetchProfile() {
    try {
      const url = PROFILE_URL + `?eth_profile_addr=${profileId}`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      const profile = await response.json();
      if (profile.error) {
        setProfileFound(false);
        return;
      }
      setDisplayName(profile.displayName);
      setProfileAddr(profile.profileAddr);
      setUsername(profile.username);
      setTwitterHandle(profile.twitterHandle);
      setTwitterCred(profile.twitterCred);
      setDomainName(profile.domainName);
      setDomainCred(profile.domainCred);
      setProfileFound(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setProfileFound(false);
    }
  }

  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
    }
  },[profileId])

  function toggleTwitter() {
    setShowingTwitter(!showingTwitter);
  }

  function toggleDomain() {
    setShowingDomain(!showingDomain);
  }

  function onMessageCopied() {
    setSuccessMsg('Address copied to clipboard!')
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <PuffLoader color="blue" loading={true} size={200} />
      </div>
    );
  }
  
  if (!profileFound) {
    return (
      <main >
        <div className="rounded-lg flex-1 flex-column items-center max-w-2xl mx-auto mt-24 p-6 overflow-y-auto bg-white" tabIndex="0">
          <div className="bg-gray-white text-center">
            <span className="inline-block h-14 w-14 rounded-full overflow-hidden bg-gray-100">
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          </div>
          <div className="bg-gray-50 text-red-500 text-center p-2 text-3xl mt-3">
            <span>Profile Not Found</span>
          </div>
          <div className="bg-gray-50 text-red-400 text-center text-2xl">
            <span>Please check the URL!</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <NotificationPanel show={!!successMsg} bgColor="bg-green-400" message={successMsg} />
      <JsonModal show={showingTwitter} title="Twitter Verification" json={twitterCred} onCancel={toggleTwitter}> 
        <div className="h-14 bg-gray-100 p-2">
          <span className="mr-4">Handle:</span>
          <input 
            type="text" 
            name="username" 
            value={twitterHandle}
            disabled
            className="h-10 w-72 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      </JsonModal>
      <JsonModal show={showingDomain} title="Domain Name Verification" json={domainCred} onCancel={toggleDomain}> 
        <div className="h-14 bg-gray-100 p-2">
          <span className="mr-4">Domain Name:</span>
          <input 
            type="text" 
            name="domainName" 
            value={domainName}
            disabled
            className="h-10 w-72 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-md border-gray-300 rounded-md bg-gray-50" 
          />
        </div>
      </JsonModal>
      <main >
        <div className="rounded-lg flex-1 flex-column items-center max-w-2xl mx-auto mt-24 p-6 overflow-y-auto bg-white" tabIndex="0">
          <div className="bg-gray-white text-center">
            <span className="inline-block h-14 w-14 rounded-full overflow-hidden bg-gray-100">
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          </div>
          <div className="bg-gray-50 text-center p-2 text-3xl mt-3">
            <span>{displayName}</span>
          </div>
          <div className="bg-gray-50 text-center text-2xl">
            <span>@{username}</span>
          </div>
          <div className="bg-gray-50 text-center pt-3">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="text-md">
                <tr className={`text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 group`} >
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row space-x-3 justify-center items-center bg-gray-50 text-center pt-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div className="mt-1">
              <span>Profile Addr: {shortenAddr(profileAddr)}</span>
            </div>
            <div>
              <CopyToClipboard text={profileAddr} onCopy={onMessageCopied}>
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </CopyToClipboard>
            </div>
          </div>
          <div className={`flex flex-row space-x-3 justify-center items-center ${!twitterHandle ? 'hidden' : ''} bg-gray-50 text-center pt-2`}>
            <div>
              <svg className="inline-block w-4 h-4" width="25" height="20" viewBox="0 0 32 32">
                <path d="M31.0934 8.58666C31.1883 8.5078 31.2594 8.40417 31.2989 8.28728C31.3384 8.1704 31.3446 8.04485 31.317 7.92461C31.2894 7.80438 31.2289 7.69417 31.1423 7.60626C31.0558 7.51835 30.9465 7.45618 30.8267 7.42666L29.7734 7.16C29.6776 7.13602 29.5884 7.09107 29.5121 7.02839C29.4358 6.96571 29.3744 6.88687 29.3323 6.79757C29.2902 6.70826 29.2685 6.61072 29.2687 6.51199C29.2688 6.41326 29.291 6.3158 29.3334 6.22666L29.9201 5.04C29.9755 4.92501 29.9967 4.79652 29.9813 4.66981C29.9658 4.54311 29.9143 4.4235 29.8329 4.32521C29.7514 4.22691 29.6435 4.15407 29.5219 4.11533C29.4002 4.07659 29.27 4.07358 29.1467 4.10666L26.4801 4.85333C26.3807 4.88231 26.276 4.88776 26.1742 4.86924C26.0723 4.85073 25.9762 4.80876 25.8934 4.74666C24.7394 3.88118 23.3359 3.41333 21.8934 3.41333C20.1253 3.41333 18.4296 4.11571 17.1794 5.36595C15.9291 6.61619 15.2267 8.31189 15.2267 10.08V10.56C15.2273 10.6419 15.1978 10.7211 15.1437 10.7826C15.0896 10.8441 15.0147 10.8835 14.9334 10.8933C11.1867 11.3333 7.60008 9.42666 3.73341 4.97333C3.64941 4.88069 3.5415 4.81301 3.42153 4.77772C3.30156 4.74244 3.17419 4.74092 3.05341 4.77333C2.9446 4.82334 2.85128 4.90174 2.78324 5.00028C2.7152 5.09882 2.67496 5.21386 2.66674 5.33333C2.13269 7.52712 2.34861 9.83656 3.28008 11.8933C3.30764 11.9479 3.31967 12.009 3.31485 12.0699C3.31004 12.1308 3.28857 12.1893 3.25278 12.2388C3.217 12.2884 3.16828 12.3271 3.11195 12.3508C3.05563 12.3746 2.99386 12.3823 2.93341 12.3733L1.44007 12.08C1.33402 12.0629 1.22542 12.0718 1.12352 12.1057C1.02161 12.1397 0.92942 12.1978 0.854788 12.275C0.780157 12.3523 0.725296 12.4464 0.694876 12.5494C0.664456 12.6524 0.659378 12.7613 0.680075 12.8667C0.795193 13.8899 1.13897 14.8742 1.68597 15.7466C2.23296 16.619 2.96916 17.3573 3.84008 17.9067C3.89643 17.934 3.94396 17.9766 3.97722 18.0296C4.01047 18.0827 4.02811 18.144 4.02811 18.2067C4.02811 18.2693 4.01047 18.3306 3.97722 18.3837C3.94396 18.4368 3.89643 18.4794 3.84008 18.5067L3.13341 18.7867C3.04759 18.8211 2.96986 18.873 2.90517 18.939C2.84048 19.0051 2.79024 19.0839 2.75764 19.1704C2.72503 19.2569 2.71079 19.3493 2.7158 19.4416C2.72081 19.5339 2.74497 19.6242 2.78674 19.7067C3.17753 20.5618 3.76988 21.3093 4.51301 21.8853C5.25613 22.4612 6.12785 22.8483 7.05341 23.0133C7.11776 23.0367 7.17336 23.0793 7.21265 23.1354C7.25194 23.1914 7.27302 23.2582 7.27302 23.3267C7.27302 23.3951 7.25194 23.4619 7.21265 23.518C7.17336 23.574 7.11776 23.6166 7.05341 23.64C5.24056 24.3898 3.29509 24.7662 1.33341 24.7467C1.1566 24.7113 0.97298 24.7476 0.822951 24.8476C0.672922 24.9477 0.56877 25.1032 0.533408 25.28C0.498046 25.4568 0.53437 25.6404 0.634389 25.7905C0.734409 25.9405 0.88993 26.0446 1.06674 26.08C4.46347 27.691 8.16165 28.5678 11.9201 28.6533C15.226 28.7038 18.4731 27.776 21.2534 25.9867C23.5404 24.4601 25.4141 22.3913 26.7076 19.9649C28.0011 17.5384 28.6741 14.8297 28.6667 12.08V10.92C28.6676 10.8232 28.6895 10.7277 28.7309 10.6402C28.7723 10.5527 28.8324 10.4753 28.9067 10.4133L31.0934 8.58666Z" fill="black"></path>
              </svg>
            </div>
            <div className="mt-1">
              <span>Twitter Handle: {twitterLink(twitterHandle)}</span>
            </div>
            <div>
              <a onClick={toggleDomain} className="cursor-pointer">
                <img className="inline-block" height="18" width="18" src="/images/verified.png" />
              </a>
            </div>
          </div>
          <div className={`flex flex-row space-x-3 justify-center items-center ${!domainName ? 'hidden' : ''} bg-gray-50 text-center p-2`}>
            <div>
              <svg className="inline-block w-4 h-4" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 1.63636C4.93318 1.63636 1.63636 4.93318 1.63636 9C1.63636 13.0668 4.93318 16.3636 9 16.3636C13.0668 16.3636 16.3636 13.0668 16.3636 9C16.3636 4.93318 13.0668 1.63636 9 1.63636ZM0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="black"></path><path fillRule="evenodd" clipRule="evenodd" d="M0 9C0 8.44772 0.366312 8 0.818182 8H17.1818C17.6337 8 18 8.44772 18 9C18 9.55228 17.6337 10 17.1818 10H0.818182C0.366312 10 0 9.55228 0 9Z" fill="black"></path><path fillRule="evenodd" clipRule="evenodd" d="M6.60019 8.86481C6.65501 11.4184 7.501 13.8768 9 15.8816C10.499 13.8768 11.345 11.4184 11.3998 8.86481C11.345 6.31124 10.499 3.85278 9 1.84798C7.501 3.85278 6.65501 6.31124 6.60019 8.86481ZM9 0.560089L8.40932 0C6.27751 2.42276 5.06601 5.56688 5.00017 8.84751C4.99994 8.85904 4.99994 8.87058 5.00017 8.88211C5.06601 12.1627 6.27751 15.3069 8.40932 17.7296C8.56089 17.9019 8.77526 18 9 18C9.22474 18 9.43911 17.9019 9.59068 17.7296C11.7225 15.3069 12.934 12.1627 12.9998 8.88211C13.0001 8.87058 13.0001 8.85904 12.9998 8.84751C12.934 5.56688 11.7225 2.42276 9.59068 0L9 0.560089Z" fill="black"></path>
              </svg>
            </div>
            <div className="mt-1">
              <span>Domain Name: {domainLink(domainName)}</span>
            </div>
            <div>
              <a onClick={toggleDomain} className="cursor-pointer">
                <img className="inline-block" height="18" width="18" src="/images/verified.png" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
