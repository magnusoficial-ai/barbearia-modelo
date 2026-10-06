import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
// BT.709 em faixa limitada: padrão de vídeo para web e redes (evita preto lavado)
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);

// Use um Chrome já instalado na máquina, se o download automático do Remotion
// estiver bloqueado: REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
