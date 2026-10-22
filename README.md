# Landing page — Thiago Heckler

Site estático (HTML, CSS e JS puro, sem build) para me apresentar como desenvolvedor.

O hero tem um filme gerado no **Higgsfield** (Kling 3.0, a partir de dois quadros-chave feitos com GPT Image 2.5) que avança conforme o scroll: fragmentos soltos se montam em um bloco sólido. O vídeo foi recodificado com todos os quadros como keyframe (`ffmpeg -g 1`), o que deixa o scrub suave.

Paleta: `#d7303a` (vermelho) · `#d6e8f4` (azul gelo) · `#0c0e0b` (quase preto) · `#ffffff`.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Hospedar a mídia no próprio servidor

Por padrão o vídeo vem do CDN do Higgsfield (carregado direto pela URL, compatível com CSPs que bloqueiam `blob:`). Para não depender dele:

```bash
./scripts/baixar-midia.sh   # salva em assets/
```

O `main.js` usa `assets/` automaticamente quando os arquivos existem. (~5 MB no total)

## Antes de publicar

- Troque o e-mail de contato em `index.html` (está marcado com `TODO`) e adicione WhatsApp/LinkedIn se quiser.
- Complete as descrições de **Mais Músculo** e **Giro Market** na seção de projetos.

## Deploy

Qualquer hospedagem estática serve: Nginx na VPS, GitHub Pages, Netlify ou Vercel. Basta servir a pasta raiz.
