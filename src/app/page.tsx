'use client'
import CreatePoll from '@/components/vote/CreatePoll'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { initializePoll } from '../hooks/blockChain'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import Error from '@/components/modals/Error'
import { getAllPolls } from '@/api/getAllPolls'
type activeTabType = 'create-poll' | 'browse-vote'

export default function Home() {
  const [description, setDescription] = useState<string>('')
  const [startDate, setStartDate] = useState<number>(0)
  const [endDate, setEndDate] = useState<number>(0)
  const [errorModal, setErrorModal] = useState(false)
  const [activeTab, setActiveTab] = useState<activeTabType>('create-poll')
  const { mutate, isPending, error } = initializePoll()
  const {data:allPollsData} = getAllPolls()
  const uuid = uuidv4()
  const { connected } = useWallet()
  const queryClient = useQueryClient()
  const handleCreatePoll = async () => {
    if (!startDate) {
      toast.error('Please provide start date!')
      return
    }
    if (!endDate) {
      toast.error('Please provide end date!')
      return
    }
    if (!connected) {
      toast.error('Please connect your wallet first!')
      return
    }
    const convertedStartDate = Math.floor(startDate / 1000)
    const convertedEndDate = Math.floor(endDate / 1000)
  
    const safePollId = uuid.slice(0, 32)
    const payload = {
      pollId: safePollId,
      description,
      startDate: convertedStartDate,
      endDate: convertedEndDate,
    }

    mutate(payload, {
      onSuccess: (data) => {
        console.log('data from poll account', data)
        queryClient.invalidateQueries({ queryKey: ['polls'] })
        toast.success('Poll created successfully!')
        setDescription('')
        setStartDate(0)
        setEndDate(0)
      },
      onError: (error) => {
        toast.error(error.message)
        return
      },
    })
  }

  return (
    <div className="relative w-full h-screen multi-layer-bg overflow-y-scroll flex flex-col p-4">
      <div className="flex flex-col p-2">
        <div className="flex justify-center items-center">
          <div className="border border-gray-400 rounded-2xl">
            <button
              onClick={() => setActiveTab('create-poll')}
              className={`rounded-t-2xl rounded-r-[0px] text-2xl hover:bg-gray-700 px-20 py-2  ${
                activeTab === 'create-poll'
                  ? 'bg-gray-700 border-b-[5px] border-blue-500'
                  : 'bg-slate-900 border-b-[5px] border-gray-500 '
              }`}
            >
              Create Poll
            </button>
            <button
              onClick={() => setActiveTab('browse-vote')}
              className={`rounded-t-2xl rounded-l-[0px] text-2xl px-20 py-2 hover:bg-gray-700 bg-slate-900 ${
                activeTab === 'browse-vote'
                  ? 'bg-gray-700 border-b-[5px] border-blue-500'
                  : 'bg-slate-900 border-b-[5px] border-gray-500 '
              }`}
            >
              Browse Vote
            </button>
            {activeTab == 'create-poll' && (
              <CreatePoll
                isCreating={isPending}
                isConnected={connected}
                description={description}
                setDescription={setDescription}
                startDate={Number(startDate)}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                handleCreatePoll={handleCreatePoll}
              />
            )}
          </div>
        </div>
        {/* New Content Section Below the Card */}
        <div className="mt-12 max-w-4xl mx-auto space-y-8 pb-12">
          {/* Why Choose Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Decentralized Voting on Solana
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Create transparent, tamper-proof polls powered by blockchain technology. 
              Every vote is recorded on-chain, ensuring complete transparency and security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Immutable</h3>
              <p className="text-gray-300 text-sm">
                All votes are recorded on Solana blockchain, making them permanent and tamper-proof.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">
                Powered by Solana's high-performance blockchain with sub-second finality.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-3">👁️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Fully Transparent</h3>
              <p className="text-gray-300 text-sm">
                Every vote is verifiable on-chain. No hidden manipulation, complete transparency.
              </p>
            </div>
          </div>
          {/* Stats Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-8 mt-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {allPollsData?.length || 0}
                </div>
                <div className="text-gray-300">Total Polls Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">Transparent & Verifiable</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">&lt;1s</div>
                <div className="text-gray-300">Vote Confirmation Time</div>
              </div>
            </div>
          </div>
          {/* How It Works */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 min-w-[40px]">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Connect Your Wallet</h4>
                  <p className="text-gray-300 text-sm">
                    Use any Solana-compatible wallet to get started securely.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 min-w-[40px]">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Create or Browse Polls</h4>
                  <p className="text-gray-300 text-sm">
                    Set up your own poll with candidates and dates, or participate in existing ones.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 min-w-[40px]">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Vote & Verify</h4>
                  <p className="text-gray-300 text-sm">
                    Cast your vote on-chain. All results are publicly verifiable and permanent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {true && (
          <Error
            onClose={() => setErrorModal(false)}
            isOpen={errorModal}
            className="absolute"
            errorMessage={error?.message}
          />
        )}
      </div>
    </div>
  )
}