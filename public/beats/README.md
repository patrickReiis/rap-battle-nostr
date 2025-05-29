# Beat Files Directory

This directory is for hosting beat audio files locally to avoid CORS issues with external CDNs.

## How to Add Beats

1. Download royalty-free beats from sources like:
   - Pixabay
   - Free Music Archive
   - YouTube Audio Library
   - Freesound.org

2. Place the audio files (MP3, WAV, OGG) in this directory

3. Update the `audioUrl` in `/src/lib/beats.ts` to use local paths:
   ```typescript
   audioUrl: '/beats/your-beat-file.mp3'
   ```

## Temporary Solution

Until beats are added locally, the application will fall back to synthesized beats using the Web Audio API.

## License Considerations

Only use beats that are:
- Royalty-free
- Creative Commons licensed
- Public domain
- Or have explicit permission for use

Always credit the original producers when required by the license.