import { fetchNewestAlbums } from '../api/album'

export async function fetchLimitNewAlbums(limit) {
  const albums = await fetchNewestAlbums().then(res => res.albums)
  return albums.slice(0, limit)
}
