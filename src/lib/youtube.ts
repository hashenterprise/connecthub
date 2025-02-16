// src/lib/youtube.ts
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function searchEducationalVideos(query: string) {
  const response = await youtube.search.list({
    part: ['snippet'],
    q: query,
    type: ['video'],
    videoCategory: '27', // Education category
    maxResults: 50
  });

  return response.data.items;
}