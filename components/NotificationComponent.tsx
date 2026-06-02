import { useState,useEffect } from "react";
import { useSession } from "next-auth/react";

type NotificationComponentProps = {
    onClose: () => void;
};

export default function NotificationCOmponent({ onClose }: NotificationComponentProps) {
    const [followups, setFollowups] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
        async function getFollowUps() {
            const data = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/FollowUps?empId=${session?.user.id}`)
            const fetchedData = await data.json()
            setFollowups(fetchedData.followUps)
        }
        getFollowUps();
    }, [session])
    console.log(followups)
    return (
        <div className="w-fit h-fit bg-black/50 flex justify-center items-center fixed top-12 right-5 z-50">
            <div className="w-fit- h-fit ">
                bus a assumenda accusantium hic perspiciatis laboriosam porro, nobis adipisci molestias.
            </div>
        </div>
    )
}