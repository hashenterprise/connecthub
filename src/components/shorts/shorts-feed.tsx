import { useEffect } from 'react';
import { ShortPlayer } from './short-player';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

export function ShortsFeed() {
  const { data: shorts, fetchNextPage, hasNextPage, isLoading } = useInfiniteScroll('/api/shorts');

  return (
    <div className="snap-y snap-mandatory h-[calc(100vh-64px)] overflow-y-scroll">
      {shorts.map((short) => (
        <div key={short.id} className="snap-start h-[calc(100vh-64px)]">
          <ShortPlayer
            videoUrl={short.videoUrl}
            caption={short.caption}
            likes={short.likes}
            comments={short.comments}
          />
        </div>
      ))}
      {isLoading && <div className="flex justify-center p-4">Loading...</div>}
    </div>
  );
}