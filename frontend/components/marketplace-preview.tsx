import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function MarketplacePreview() {
  const nfts = [
    {
      id: 1,
      title: "Amazon Rainforest Protection",
      carbonOffset: 25,
      price: 0.15,
      owner: "0x7a86...3e4f",
      image: "/rain.jpg",
    },
    {
      id: 2,
      title: "Solar Farm Initiative",
      carbonOffset: 18,
      price: 0.12,
      owner: "0x3b42...9c1d",
      image: "/solar.jpeg",
    },
    {
      id: 3,
      title: "AFFORESTATION",
      carbonOffset: 32,
      price: 0.21,
      owner: "0xf12c...7e8a",
      image: "/vhuth.png",
    },
    // {
    //   id: 4,
    //   title: "Ocean Cleanup Venture",
    //   carbonOffset: 15,
    //   price: 0.09,
    //   owner: "0x9d4e...2b5f",
    //   image: "/placeholder.svg?height=200&width=300",
    // },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Marketplace Preview
          </h2>
          <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card
              key={nft.id}
              className="bg-gray-900 border-emerald-900/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
            >
              <CardContent className="p-0">
                <div className="relative">
                <Image
  src={nft.image}
  alt={nft.title}
  width={400}
  height={200}
  className="w-full aspect-[4/3] object-cover rounded-t-lg"
/>
                  <Badge className="absolute top-3 right-3 bg-emerald-500 text-black font-medium">
                    {nft.carbonOffset} tons
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-white">{nft.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">Owner: {nft.owner}</div>
                    <div className="text-emerald-400 font-bold">{nft.price} ETH</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-800/50 p-4 border-t border-emerald-900/30">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-black font-medium">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
