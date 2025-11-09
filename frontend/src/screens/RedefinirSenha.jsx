//pagina de redefinicao de senha do usuario
//importacao
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function RedefinirSenhaForm({ onConfirm }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = (e) => {
    e.preventDefault();

    if (novaSenha.trim() === "" || confirmarSenha.trim() === "") {
      toast.error("Preencha os dois campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    // Simula pequeno atraso só para UX; remove se preferir instantâneo. 
    setTimeout(() => {
      // Chama callback opcional para integração com backend 
      if (typeof onConfirm === "function") {
        try {
          onConfirm(novaSenha);
        } catch (err) {
          // não falha se o callback der erro
          console.error("onConfirm callback error:", err);
        }
      }

      toast.success("Senha confirmada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Redefinir senha
      </h2>

      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova senha
          </label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nova senha
          </label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
        >
          {loading ? "Confirmando..." : "Confirmar nova senha"}
        </button>
      </form>
    </div>
  );
}

