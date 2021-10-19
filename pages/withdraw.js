import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers';
import { useAuth } from '../context/auth';
import { getNativeBalance, getBalance } from '../lib/ethereum';
import Button from '../components/Button';
import Layout from '../components/AppLayout';
import LoaderButton from "../components/LoaderButton";
import NotificationPanel from '../components/NotificationPanel';
import Protected from '../components/Protected';
import SOURCECHECK_PROFILE_ABI from '../contracts/SourceCheckProfile';

// DAI Token data
const DAI_ADDR = process.env.NEXT_PUBLIC_DAI_ADDR;
const DAI_DEC = process.env.NEXT_PUBLIC_DAI_DEC;

// USDC Token data
const USDC_ADDR = process.env.NEXT_PUBLIC_USDC_ADDR;
const USDC_DEC = process.env.NEXT_PUBLIC_USDC_DEC;

export default function Profile() {
  const { active, library: provider } = useWeb3React();
  const { user } = useAuth();
  
  // Token balances
  const [maticBalance, setMaticBalance] = useState(null);
  const [daiBalance, setDaiBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  
  // UI state
  const [withdrawingMATIC, setWithdrawingMATIC] = useState(false);
  const [withdrawingDAI, setWithdrawingDAI] = useState(false);
  const [withdrawingUSDC, setWithdrawingUSDC] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function canWithdraw() {
    return user && user.eth_profile_addr && active;
  }

  useEffect(() => {
    //activate(injected);
  });

  useEffect(() => {
    if (canWithdraw()) {
      fetchBalances()
    }
  }, [user, provider]);

  async function fetchBalances() {
    try {
      const signer = await provider.getSigner();
      const maticBalance = await getNativeBalance(user.eth_profile_addr, signer);
      const daiBalance = await getBalance(user.eth_profile_addr, DAI_ADDR, DAI_DEC, signer);
      const usdcBalance = await getBalance(user.eth_profile_addr, USDC_ADDR, USDC_DEC, signer);
      setMaticBalance(maticBalance);
      setDaiBalance(daiBalance);
      setUsdcBalance(usdcBalance);
    } catch (err) {
      setErrorMsg(`Unable to fetch balances! - ${err.message}`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  async function withdrawMATIC() {
    try {
      setWithdrawingMATIC(true);
      const signer = await provider.getSigner();
      const profileContract = new ethers.Contract(user.eth_profile_addr, SOURCECHECK_PROFILE_ABI, signer);

      // Create an event filter
      const filter = profileContract.filters.EvtNativeWithdraw();

      // Event listener
      const onNativeWithdraw = function (evt) {

        // Unsubscribe to event
        profileContract.off(filter, onNativeWithdraw);

        // Fetch new balances
        fetchBalances();
        
        // Notify user
        setWithdrawingMATIC(false);
        setSuccessMsg("Withdraw successful!");
        setTimeout(() => setSuccessMsg(''), 3000);
      }

      // Subscribe to event
      profileContract.on(filter, onNativeWithdraw);

      // Send withdraw transaction
      await profileContract.nativeWithdraw();

    } catch (err) {
      setWithdrawingMATIC(false);
      setErrorMsg(`Error withdrawing tokens: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  }

  async function withdrawDAI() {
    try {
      setWithdrawingDAI(true);
      const signer = await provider.getSigner();
      const profileContract = new ethers.Contract(user.eth_profile_addr, SOURCECHECK_PROFILE_ABI, signer);
      
      // Create an event filter
      const filter = profileContract.filters.EvtWithdraw(DAI_ADDR);
           
      // Event listener
      const onWithdraw = function (tokenAddr, evt) {

        // Unsubscribe to event
        profileContract.off(filter, onWithdraw);

        // Fetch new balances
        fetchBalances();
        
        // Notify user
        setWithdrawingDAI(false);
        setSuccessMsg("Withdraw successful!");
        setTimeout(() => setSuccessMsg(''), 3000);
      }

      // Subscribe to event
      profileContract.on(filter, onWithdraw);

      // Send withdraw transaction
      await profileContract.withdraw(DAI_ADDR);

    } catch (err) {
      setWithdrawingDAI(false);
      setErrorMsg(`Error withdrawing tokens: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  async function withdrawUSDC() {
    try {
      setWithdrawingUSDC(true);
      const signer = await provider.getSigner();
      const profileContract = new ethers.Contract(user.eth_profile_addr, SOURCECHECK_PROFILE_ABI, signer);
      
      // Create an event filter
      const filter = profileContract.filters.EvtWithdraw(USDC_ADDR);
           
      // Event listener
      const onWithdraw = function (tokenAddr, evt) {

        // Unsubscribe to event
        profileContract.off(filter, onWithdraw);

        // Fetch new balances
        fetchBalances();
        
        // Notify user
        setWithdrawingUSDC(false);
        setSuccessMsg("Withdraw successful!");
        setTimeout(() => setSuccessMsg(''), 3000);
      }

      // Subscribe to event
      profileContract.on(filter, onWithdraw);

      // Send withdraw transaction
      await profileContract.withdraw(USDC_ADDR);

    } catch (err) {
      setWithdrawingUSDC(false);
      setErrorMsg(`Error withdrawing tokens: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <>
      <NotificationPanel show={!!successMsg} message={successMsg} bgColor="bg-green-400" />
      <NotificationPanel show={!!errorMsg} message={errorMsg} bgColor="bg-red-400" />
      <Protected>
        <Layout>
          <main className="flex-1 overflow-y-auto focus:outline-none py-6" tabIndex="0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden mt-6">
                <div className="px-4 py-5 bg-white space-y-5 sm:p-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Withdraw Page</h1>
                  <div className={`${user && user.eth_profile_addr ? '' : 'hidden'} col-span-6 sm:col-span-4`}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Verified Profile Contract Address</label>
                    <input 
                      type="text" 
                      name="profileAddr" 
                      value={user && user.eth_profile_addr ? user.eth_profile_addr : ''}
                      disabled
                      className="mt-1 text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md" 
                    />
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th scope="col" className="px-6 py-2 ">Token</th>
                        <th scope="col" className="px-6 py-2 ">
                          <div className="flex flex-row items-center">
                            <div className="mr-2">Balance</div>
                            <div>
                              <a className="cursor-pointer" onClick={fetchBalances}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </a>
                           </div>
                          </div>
                        </th>
                        <th scope="col" className="px-2 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-md">
                      <tr className={`text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 group`} >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <img className="mr-3" width="20" height="20" src="/images/matic.png" />
                            <span>Polygon (MATIC)</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1">{maticBalance} MATIC</span>
                        </td>
                        <td className="py-4 whitespace-nowrap text-right">
                          { withdrawingMATIC ? (
                            <LoaderButton color="indigo" loading={withdrawingMATIC} />
                          ) : (
                            <Button label="Withdraw" color="indigo" onClick={withdrawMATIC} disabled={!canWithdraw()} />
                          )}
                        </td>
                      </tr>
                      <tr className={`text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 group`} >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <img className="mr-3" width="20" height="20" src="/images/dai.png" />
                            <span>Dai Stablecoin</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1">{daiBalance} DAI</span>
                        </td>
                        <td className="py-4 whitespace-nowrap text-right">
                          { withdrawingDAI ? (
                            <LoaderButton color="indigo" loading={withdrawingDAI} />
                          ) : (
                            <Button label="Withdraw" color="indigo" onClick={withdrawDAI} disabled={!canWithdraw()} />
                          )}
                        </td>
                      </tr>
                      <tr className={`text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 group`} >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <div className="flex items-center">
                            <img className="mr-3" width="20" height="20" src="/images/usdc.png" />
                            <span>USD Coin</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-1">{usdcBalance} USDC</span>
                        </td>
                        <td className="py-4 whitespace-nowrap text-right">
                          { withdrawingUSDC ? (
                            <LoaderButton color="indigo" loading={withdrawingUSDC} />
                          ) : (
                            <Button label="Withdraw" color="indigo" onClick={withdrawUSDC} disabled={!canWithdraw()} />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> 
              </div>
            </div>
          </main>
        </Layout>
      </Protected>
    </>
  );
}
