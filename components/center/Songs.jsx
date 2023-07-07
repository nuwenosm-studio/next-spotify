import { useRecoilValue } from "recoil";
import { playlistState } from "@/atoms/playlistAtom";
import SongItem from "./SongItem";

const Songs = () => {
   const playlist = useRecoilValue(playlistState);




   return (
      <div className="px-8 flex flex-col
         space-y-1 pb-28"
      >
         {playlist?.tracks.items.map((track, i) => (
            <SongItem 
               key={track.track.id}
               track={track}
               order={i}
            />
         ))}
      </div>
   );
}
 
export default Songs;