"use client"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function WebsiteList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [websiteList, setWebsiteList] = useState([]);

  useEffect(() => {
    async function fetchWebsites() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website/WebsiteAccess?employeeId=${session?.user.id}`);
      const website = await response.json();
      const data = website.data.websites.map((x: any) => { return x.name })
      setWebsiteList(data);
      setIsLoading(false)
    }
    if (session?.user.id)
      fetchWebsites();
  }, [session?.user.id])

  return (
    isLoading ? <div className=" min-h-screen flex justify-center items-center">
      <div>Loading websites...</div>
    </div> :
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="mb-5">Choose website:</div>
        <div className="flex flex-wrap gap-4">
          {websiteList.map((website, index) => (
            <div
              onClick={() => {
                router.push(`/Employee?website=${website}`)
              }}
              key={index}
              className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer border-2 border-black rounded-lg px-6 py-4 text-lg shadow-2xl font-semibold"
            >
              {website}
            </div>
          ))}
        </div>
      </div>
  )
}
