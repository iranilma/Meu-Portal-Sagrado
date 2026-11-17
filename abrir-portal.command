#!/bin/bash
# ==============================================================================
# MEU PORTAL SAGRADO — INICIALIZADOR LOCAL (macOS)
# Inicia servidor local para fornecer origem HTTP válida e evitar o Erro 153 do YouTube
# ==============================================================================

cd "$(dirname "$0")"

PORT=8080

# Verifica se a porta 8080 já está em execução
if lsof -i :$PORT >/dev/null 2>&1; then
  # Se já estiver rodando, testa se responde ao Portal Sagrado
  if ! curl -s "http://127.0.0.1:$PORT" | grep -q "PORTAL SAGRADO"; then
    PORT=8088
    if ! lsof -i :$PORT >/dev/null 2>&1; then
      python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &
      sleep 0.8
    fi
  fi
else
  # Inicia servidor Python em segundo plano
  python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &
  sleep 0.8
fi

echo "✨ Abrindo Meu Portal Sagrado em http://localhost:$PORT ..."
open "http://localhost:$PORT"
