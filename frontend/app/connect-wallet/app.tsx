
import { Core } from '@walletconnect/core'
import { WalletKit } from '@reown/walletkit'

const core = new Core({
  projectId: '332906f59003c1e360cceb1cd08b6a7c'
})

const metadata = {
  name: 'hackathon',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

const walletKit = await WalletKit.init({
  core, // <- pass the shared 'core' instance
  metadata
})