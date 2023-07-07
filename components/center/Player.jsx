import { 
   HeartIcon,
   ArrowsRightLeftIcon,
   SpeakerWaveIcon,
   ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { 
   BackwardIcon,
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/solid";


import useSpotify from "@/hooks/useSpotify";
import useSongInfo from "@/hooks/useSongInfo";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { debounce } from "lodash";


const Player = () => {
   const spotifyApi = useSpotify();
   const songInfo   = useSongInfo();

   const { data: session, status } = useSession();
   const [ currentTrackId, setCurrentIdTrack ] = useRecoilState(currentTrackIdState);
   const [ isPlaying, setIsPlaying ] = useRecoilState(isPlayingState);
   const [ volume, setVolume] = useState(50);

   const fetchCurrentSong = () => {
      if (!songInfo) {
         spotifyApi.getMyCurrentPlayingTrack().then(data => {
            setCurrentIdTrack(data.body?.item?.id);

            spotifyApi.getMyCurrentPlaybackState().then(data => {
               setIsPlaying(data.body?.is_playing);
            })
         })
      }
   }

   const handlePlayPause = () => {
      spotifyApi.getMyCurrentPlaybackState().then(data => {
         if (data.body.is_playing) {
            spotifyApi.pause();
            setIsPlaying(false);
         } else {
            spotifyApi.play();
            setIsPlaying(true);
         }
      })
   };

   useEffect(() => {
      if (spotifyApi.getAccessToken() && !currentTrackId) {
         fetchCurrentSong();
         setVolume(50);
      }
   }, [ currentTrackIdState, spotifyApi, session ]);

   useEffect(() => {
      if (volume > 0 && volume < 100) {
         debounceAdjustVolume(volume);
      }
   }, [volume]);

   const debounceAdjustVolume = useCallback(
      debounce(
         volume => {
            spotifyApi.setVolume(volume).catch(err => {console.error(err);})
         },
         500
      ), []
   )

   return (
      <div className="bg-gradient-to-b from-black to-gray-900
         h-24 text-white grid grid-cols-3
         text-xs md:text-base px-2 md:px-8"
      >
         {/* Left  */}
         <div className="flex items-center space-x-4">
            <img 
               className="hidden md:inline h-10 w-10"
               src={songInfo?.album.images?.[0]?.url}
               alt="" 
            />
            <div>
               <h3>
                  {songInfo?.name}
               </h3>
               <p>
                  {songInfo?.artists?.[0]?.name}
               </p>
            </div>
         </div>

         {/* Center  */}
         <div className="flex items-center justify-evenly">
            <ArrowsRightLeftIcon className="button" />
            <BackwardIcon 
               className="button" 
               // onClick={() => spotifyApi.skipToPrevious()}
            />
            { isPlaying 
               ?  <PauseCircleIcon 
                     className="button w-10 h-10"
                     onClick={handlePlayPause}
                  />
               :  <PlayCircleIcon  
                     className="button w-10 h-10"
                     onClick={handlePlayPause}
                  />
            }
            <ForwardIcon 
               className="button" 
               // onClick={() => spotifyApi.skipToNext()}
            />
            <ArrowPathIcon className="button" />
         </div>
         {/* Right  */}
         <div className="flex items-center justify-end 
            space-x-3 md:space-x-4 pr-5"
         >
            <SpeakerWaveIcon 
               className="button"
               onClick={() => {
                  volume > 0 && setVolume(volume-10)
                  console.log(volume)
               }} 
            />
            <input 
               className="w-14 md:w-28"
               type="range" 
               value={volume}
               min={0}
               max={100}
               onChange={e => setVolume(Number(e.target.value))}
            />
         </div>
      </div>
   );
}
 
export default Player;