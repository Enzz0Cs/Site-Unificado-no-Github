import UsuarioModel from "../models/UsuarioModel.js";

class AuthController {

    static async login(req, res) {
        const { email, senha } = req.body;
        const usuario = await UsuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            nivel: usuario.nivel_acesso
        });
    }

    static async registrar(req, res) {
        const { nome, email, senha, nivel_acesso } = req.body;

        try {
            const existe = await UsuarioModel.buscarPorEmail(email);
            if (existe) {
                return res.status(400).json({ error: "E-mail já cadastrado" });
            }

            const id = await UsuarioModel.criar(nome, email, senha, nivel_acesso || 'usuario');
            res.status(201).json({ message: "Cadastrado com sucesso!", id });
        } catch (error) {
            res.status(500).json({ error: "Erro ao cadastrar usuário" });
        }
    }

    static async resetarSenha(req, res) {
        const { email, novaSenha } = req.body;

        try {
            const sucesso = await UsuarioModel.atualizarSenha(email, novaSenha);
            if (!sucesso) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            res.json({ message: "Senha alterada com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar senha" });
        }
    }
}

export default AuthController;