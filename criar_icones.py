from PIL import Image, ImageDraw, ImageFont
import os

def criar_icone(tamanho, nome_arquivo):
    # Criar imagem com fundo verde
    img = Image.new('RGB', (tamanho, tamanho), color='#4CAF50')
    draw = ImageDraw.Draw(img)
    
    # Adicionar círculo branco no centro
    margem = tamanho // 4
    draw.ellipse([margem, margem, tamanho-margem, tamanho-margem], 
                 fill='white', outline='white')
    
    # Salvar
    img.save(nome_arquivo, 'PNG')
    print(f'✅ Criado: {nome_arquivo}')

# Criar os ícones
criar_icone(192, 'icon-192.png')
criar_icone(512, 'icon-512.png')

print('\n🎉 Ícones criados com sucesso!')
