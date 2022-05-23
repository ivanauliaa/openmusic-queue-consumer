const { Pool } = require('pg/lib');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const stmt = {
      text: 'SELECT id, name FROM playlists WHERE playlists.id = $1',
      values: [playlistId],
    };
    let result = await this._pool.query(stmt);

    const playlist = result.rows[0];

    const songStmt = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      JOIN playlist_songs
      ON playlists.id = playlist_songs.playlist_id
      JOIN songs
      ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    result = await this._pool.query(songStmt);

    playlist.songs = result.rows;

    return playlist;
  }
}

module.exports = PlaylistsService;
