import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, InputGroup, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Pencil, Trash2, Search, Check, Info } from 'lucide-react';
import './EstilosAbrigo.css';
import AnimalService from '../services/AnimalService';
import VacinaService from '../services/VacinaService';
import HistoricoService from '../services/HistoricoService';

const GerenciadorAbrigoAnimais = () => {

    const [animais, setAnimais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    const [showModal, setShowModal] = useState(false);
    const [showVacinaModal, setShowVacinaModal] = useState(false);

    const [animalSelecionado, setAnimalSelecionado] = useState(null);
    const [vacinas, setVacinas] = useState([]);
    const [historico, setHistorico] = useState([]);

    const [formVacina, setFormVacina] = useState({
        vacina_id: '',
        data_aplicacao: '',
        observacoes: ''
    });

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
            setAnimais([]);
            setMensagem({ tipo: 'danger', texto: 'Erro ao carregar dados.' });
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
            const { id, ...dadosParaEnviar } = formData;
            const payload = formData.id ? formData : dadosParaEnviar;

            await AnimalService.salvar(payload);

            setMensagem({
                tipo: 'bg-pink',
                texto: formData.id ? 'Atualizado!' : 'Cadastrado!'
            });

            setShowModal(false);
            carregarAnimais();
        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar.' });
        }
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Deseja excluir este animal?")) {
            await AnimalService.excluir(id);
            carregarAnimais();
        }
    };

    // 🔥 VACINA
    const abrirModalVacina = async (animal) => {
        setAnimalSelecionado(animal);
        setShowVacinaModal(true);

        const vacinasLista = await VacinaService.listar();
        setVacinas(vacinasLista.data || vacinasLista);

        const hist = await HistoricoService.listar(animal.id || animal.animal_id);
        setHistorico(hist);
    };

    const aplicarVacina = async () => {
        try {
            await HistoricoService.aplicar({
                animal_id: animalSelecionado.id || animalSelecionado.animal_id,
                ...formVacina
            });

            setMensagem({ tipo: 'info', texto: 'Vacina aplicada!' });

            setShowVacinaModal(false);
            setFormVacina({
                vacina_id: '',
                data_aplicacao: '',
                observacoes: ''
            });

        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao aplicar vacina.' });
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">

            <header className="navbar custom-navbar shadow-sm p-3 mb-4 sticky-top">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/home" className="btn btn-dark me-3 custom-btn-back">
                            <ArrowLeft size={20} />
                        </Link>
                        <span className="navbar-brand custom-title text-white">
                            🐾 Abrigo de Teodoro Sampaio
                        </span>
                    </div>

                    <Button className="custom-btn d-flex align-items-center gap-2" onClick={() => handleShow()}>
                        <PlusCircle size={18} /> Cadastrar
                    </Button>
                </div>
            </header>

            <Container>

                <InputGroup className="mb-4">
                    <InputGroup.Text><Search size={16} /></InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar animal..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </InputGroup>

                {mensagem.texto && (
                    <Alert variant="light" dismissible onClose={() => setMensagem({})}>
                        {mensagem.texto}
                    </Alert>
                )}

                {isLoading ? (
                    <div className="text-center py-5">Carregando...</div>
                ) : animais.length === 0 ? (
                    <div className="text-center py-5">
                        <Info size={40} />
                        <p>Nenhum animal encontrado</p>
                    </div>
                ) : (
                    <Row>
                        {animais.map(animal => (
                            <Col lg={4} md={6} key={animal.id || animal.animal_id} className="mb-4">
                                <Card className="custom-card h-100 shadow-sm">

                                    <Card.Body>
                                        <h5>{animal.nome_animal}</h5>
                                        <p><strong>Raça:</strong> {animal.raca}</p>
                                        <p><strong>Sexo:</strong> {animal.sexo}</p>
                                    </Card.Body>

                                    <Card.Footer className="d-flex gap-2 justify-content-end">

                                        <Button size="sm" onClick={() => abrirModalVacina(animal)}>
                                            💉
                                        </Button>

                                        <Button size="sm" onClick={() => handleShow(animal)}>
                                            <Pencil size={16} />
                                        </Button>

                                        <Button size="sm" variant="danger" onClick={() => handleExcluir(animal.id || animal.animal_id)}>
                                            <Trash2 size={16} />
                                        </Button>

                                    </Card.Footer>

                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

            </Container>

            {/* MODAL CADASTRO */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
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
                        <Form.Select
                            value={formData.sexo}
                            onChange={e => setFormData({ ...formData, sexo: e.target.value })}
                        >
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Porte</Form.Label>
                        <Form.Select
                            value={formData.porte}
                            onChange={e => setFormData({ ...formData, porte: e.target.value })}
                        >
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
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                </Button>

                <Button className="custom-btn px-4" type="submit">
                    <Check size={18} className="me-2" />
                    {formData.id ? 'Atualizar Animal' : 'Salvar Cadastro'}
                </Button>
            </div>

        </Form>
    </Modal.Body>
</Modal>

            {/* MODAL VACINA */}
            <Modal show={showVacinaModal} onHide={() => setShowVacinaModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aplicar Vacina</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Select
                        value={formVacina.vacina_id}
                        onChange={e => setFormVacina({...formVacina, vacina_id: e.target.value})}
                    >
                        <option>Selecione</option>
                        {vacinas.map(v => (
                            <option key={v.VacinaID} value={v.VacinaID}>
                                {v.NomeVacina}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Control
                        type="date"
                        className="mt-2"
                        onChange={e => setFormVacina({...formVacina, data_aplicacao: e.target.value})}
                    />

                    <Button className="mt-3 w-100" onClick={aplicarVacina}>
                        Aplicar
                    </Button>

                    <hr/>

                    <h5>Histórico</h5>

                    {historico.map(h => (
                        <div key={h.id}>
                            {h.nome_vacina} - {new Date(h.data_aplicacao).toLocaleDateString()}
                        </div>
                    ))}

                </Modal.Body>
            </Modal>

        </div>
    );
};

export default GerenciadorAbrigoAnimais;