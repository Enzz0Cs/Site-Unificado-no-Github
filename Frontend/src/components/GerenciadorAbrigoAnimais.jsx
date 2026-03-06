import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, InputGroup, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Pencil, Trash2, Search, Check, Info } from 'lucide-react';
import './EstilosAbrigo.css';
import AnimalService from '../services/AnimalService';

const GerenciadorAbrigoAnimais = () => {
    const [animais, setAnimais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [showModal, setShowModal] = useState(false);

    const initialFormState = {
        id: null,
        nome_animal: '',
        data_cadastro: new Date().toISOString().split('T')[0],
        sexo: 'Macho',
        raca: '',
        porte: 'Médio',
        idade: '2'
    };

    const [formData, setFormData] = useState(initialFormState);

    const carregarAnimais = async (termo = '') => {
        setIsLoading(true);
        try {
            const resposta = await AnimalService.listar(termo);
            const dadosLista = Array.isArray(resposta) ? resposta : (resposta?.data || []);
            setAnimais(dadosLista);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setAnimais([]);
            setMensagem({ tipo: 'danger', texto: 'Erro ao conectar com o banco de dados.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { carregarAnimais(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => carregarAnimais(termoBusca), 400);
        return () => clearTimeout(timer);
    }, [termoBusca]);

    const handleShow = (animal = null) => {
        if (animal) {
            setFormData({
                id: animal.animal_id || animal.id,
                nome_animal: animal.nome_animal,
                data_cadastro: animal.data_cadastro ? animal.data_cadastro.split('T')[0] : '',
                sexo: animal.sexo,
                raca: animal.raca,
                porte: animal.porte,
                idade: animal.idade
            });
        } else {
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        try {
            // LIMPEZA DE DADOS: Removemos o ID se for nulo para evitar erro no POST do backend
            const { id, ...dadosParaEnviar } = formData;
            const payload = formData.id ? formData : dadosParaEnviar;

            await AnimalService.salvar(payload);

            setMensagem({
                tipo: 'bg-pink',
                texto: formData.id ? 'Cadastro atualizado com sucesso!' : 'Novo animal cadastrado!'
            });

            setShowModal(false);
            carregarAnimais();
        } catch (error) {
            console.error("Erro detalhado ao salvar:", error);
            // Exibe o erro real vindo do backend se disponível
            const erroMsg = error.response?.data?.error || 'Erro ao salvar: Verifique os campos ou a conexão.';
            setMensagem({ tipo: 'danger', texto: erroMsg });
        }
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Deseja realmente excluir este animal?")) {
            try {
                await AnimalService.excluir(id);
                setMensagem({ tipo: 'info', texto: 'Animal removido do sistema.' });
                carregarAnimais();
            } catch (error) {
                setMensagem({ tipo: 'danger', texto: 'Erro ao excluir o registro.' });
            }
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <header className="navbar custom-navbar shadow-sm p-3 mb-4 sticky-top">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/" className="btn btn-dark me-3 custom-btn-back" style={{ border: '1px solid #FF69B4' }}>
                            <ArrowLeft size={20} color="#FF69B4" />
                        </Link>
                        <span className="navbar-brand mb-0 h1 custom-title text-white">
                            🐾 Abrigo de Teodoro Sampaio
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <InputGroup className="search-group">
                            <InputGroup.Text className="bg-white border-end-0"><Search size={16} /></InputGroup.Text>
                            <Form.Control
                                placeholder="Buscar pet..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                                className="border-start-0"
                            />
                        </InputGroup>
                        <Button className="custom-btn d-flex align-items-center gap-2" onClick={() => handleShow()}>
                            <PlusCircle size={18} /> Cadastrar
                        </Button>
                    </div>
                </div>
            </header>

            <Container>
                <h2 className="text-center mb-4 custom-subtitle">Gerenciamento de Animais</h2>

                {mensagem.texto && (
                    <Alert variant={mensagem.tipo === 'bg-pink' ? 'light' : 'danger'} className={mensagem.tipo} dismissible onClose={() => setMensagem({ tipo: '', texto: '' })}>
                        {mensagem.texto}
                    </Alert>
                )}

                {isLoading ? (
                    <div className="text-center text-pink py-5">Carregando animais...</div>
                ) : animais.length === 0 ? (
                    <div className="text-center text-muted py-5 card custom-card">
                        <Info size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Nenhum animal encontrado no momento.</p>
                    </div>
                ) : (
                    <Row>
                        {animais.map(animal => (
                            <Col lg={4} md={6} key={animal.animal_id || animal.id} className="mb-4">
                                <Card className="custom-card h-100 shadow-sm border-0">
                                    <Card.Body>
                                        <h5 className="custom-card-title text-uppercase mb-3">{animal.nome_animal}</h5>
                                        <div className="small text-muted mb-2">
                                            Cadastrado em: {animal.data_cadastro ? new Date(animal.data_cadastro).toLocaleDateString('pt-BR') : 'N/A'}
                                        </div>
                                        <p className="mb-1"><strong>Raça:</strong> {animal.raca}</p>
                                        <p className="mb-1"><strong>Sexo:</strong> {animal.sexo} | <strong>Idade:</strong> {animal.idade}</p>
                                        <p className="mb-1"><strong>Porte:</strong> {animal.porte}</p>
                                    </Card.Body>
                                    <Card.Footer className="bg-transparent border-0 d-flex justify-content-end gap-2 pb-3">
                                        <Button variant="outline-warning" size="sm" onClick={() => handleShow(animal)}><Pencil size={16} /></Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleExcluir(animal.animal_id || animal.id)}><Trash2 size={16} /></Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <div className="custom-modal-content">
                    <Modal.Header closeButton className="custom-modal-header text-white">
                        <Modal.Title className="custom-modal-title text-white">
                            {formData.id ? '📝 Editar Animal' : '🐾 Novo Cadastro'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-white">
                        <Form onSubmit={handleSalvar}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome do Animal *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.nome_animal}
                                            onChange={e => setFormData({ ...formData, nome_animal: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de Cadastro *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.data_cadastro}
                                            onChange={e => setFormData({ ...formData, data_cadastro: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Raça *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.raca}
                                            onChange={e => setFormData({ ...formData, raca: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Sexo</Form.Label>
                                        <Form.Select value={formData.sexo} onChange={e => setFormData({ ...formData, sexo: e.target.value })}>
                                            <option value="Macho">Macho</option>
                                            <option value="Fêmea">Fêmea</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Porte</Form.Label>
                                        <Form.Select value={formData.porte} onChange={e => setFormData({ ...formData, porte: e.target.value })}>
                                            <option value="Pequeno">Pequeno</option>
                                            <option value="Médio">Médio</option>
                                            <option value="Grande">Grande</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Idade *</Form.Label>
                                        <Form.Select
                                            value={formData.idade}
                                            onChange={e => setFormData({ ...formData, idade: e.target.value })}
                                            required
                                        >
                                            <option value="1">Filhote</option>
                                            <option value="2">Adulto</option>
                                            <option value="3">Idoso</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                                <Button className="custom-btn px-4" type="submit">
                                    <Check size={18} className="me-2" /> {formData.id ? 'Atualizar Animal' : 'Salvar Cadastro'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
};

export default GerenciadorAbrigoAnimais;