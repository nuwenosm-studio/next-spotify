import { 
   HomeIcon, 
   MagnifyingGlassIcon, 
   BuildingLibraryIcon,
   HeartIcon,
   RssIcon,
   PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "@/atoms/playlistAtom";
import useSpotify from "@/hooks/useSpotify";


const Sidebar = () => {
   const spotifyApi = useSpotify();
   const {data: session, status } = useSession();
   const [ playlists, setPlaylists ] = useState([]);
   const [ playlistId, setPlaylistId ] = useRecoilState(playlistIdState);

   console.log("You PICKED", playlistId)
   
   useEffect(() => {
      if (spotifyApi.getAccessToken()) {
         spotifyApi.getUserPlaylists().then((data) => {
            setPlaylists(data.body.items);
         })
      }
   }, [session, spotifyApi]);


   return (
      <div className="hidden md:inline-flex p-5 pb-36
         h-screen md:w-60 lg:w-64
         overflow-y-scroll scrollbar-hide
         text-gray-500 border-r border-gray-900  
         text-sm lg:text-base"
      >
         <div className="space-y-4">
            <button className="flex items-center
               space-x-2 hover:text-white">
               <HomeIcon className="h-5 w-5"/>
               <p>Home</p>
            </button>

            <button className="flex items-center
               space-x-2 hover:text-white">
               <MagnifyingGlassIcon className="h-5 w-5"/>
               <p>Search</p>
            </button>

            <button className="flex items-center
               space-x-2 hover:text-white">
               <BuildingLibraryIcon className="h-5 w-5"/>
               <p>My Library</p>
            </button>
            <hr className="border-t-[0.1px] border-gray-700"/>

            {/* Reapeat things */}
            <button className="flex items-center
               space-x-2 hover:text-white">
               <PlusCircleIcon className="h-5 w-5"/>
               <p>Create Playlist</p>
            </button>

            <button className="flex items-center
               space-x-2 hover:text-white">
               <HeartIcon className="h-5 w-5"/>
               <p>Like Songs</p>
            </button>

            <button className="flex items-center
               space-x-2 hover:text-white">
               <RssIcon className="h-5 w-5"/>
               <p>My episodes</p>
            </button>
            <hr className="border-t-[0.1px] border-gray-700"/>

            {/* Playlist */}
            
            {playlists.map((playlist) => (
               <p 
                  key={playlist.id}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setPlaylistId(playlist.id)}
               >
                  {playlist.name}
               </p>
            ))}
         </div>
      </div>
   );
}
 
export default Sidebar;