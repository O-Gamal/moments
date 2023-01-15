import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isReady = false;
  isRunning = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) return;
    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenShots(file: File, seconds = [1, 2, 3]) {
    this.isRunning = true;
    await this.writeFileIntoMemory(file);

    const commands: string[] = [];
    seconds.forEach((second) => {
      commands.push(
        '-i',
        file.name,
        '-ss',
        `00:00:${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=500:-1',
        `output_${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);
    this.isRunning = false;
    return this.generateScreenshots(seconds);
  }

  private async writeFileIntoMemory(file: File) {
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);
  }

  private generateScreenshots(seconds: number[]) {
    const screenshots: string[] = [];
    seconds.forEach((second) => {
      const fileUrl = this.generateFileUrl(`output_${second}.png`);
      screenshots.push(fileUrl);
    });

    return screenshots;
  }

  private generateFileUrl(name: string) {
    const file = this.ffmpeg.FS('readFile', name);
    const blob = new Blob([file.buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  async generateBlobFromUrl(url: string) {
    const res = await fetch(url);
    const blob = await res.blob();

    return blob;
  }
}
