import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import './EstilosAbrigo.css';
import EstoqueService from '../services/EstoqueService';

const GerenciarEstoque = () => {

    const [itens, setItens] = useState([]);
    const [mensagem, setMensagem] = useState({});
    const [formData, setFormData] = useState({
        id: null,
        nome_item: '',
        categoria: '',
        quantidade_atual: '',
        unidade_medida: '',
        quantidade_minima: '',
        data_validade: ''
    });

    const carregar = async () => {
        try {
            const dados = await EstoqueService.listar();
            setItens(dados);
        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao carregar estoque' });
        }
    };

    useEffect(() => { carregar(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await EstoqueService.salvar(formData);

            setMensagem({ tipo: 'bg-pink', texto: 'Salvo com sucesso!' });

            setFormData({
                id: null,
                nome_item: '',
                categoria: '',
                quantidade_atual: '',
                unidade_medida: '',
                quantidade_minima: '',
                data_validade: ''
            });

            carregar();

        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar' });
        }
    };

    const editar = (item) => {
        setFormData(item);
        window.scrollTo(0, 0);
    };

    const excluir = async (id) => {
        if (window.confirm("Excluir item?")) {
            await EstoqueService.excluir(id);
            carregar();
        }
    };

    return (
        <Container className="mt-4 pb-5">

            <header className="d-flex align-items-center mb-4 gap-3">
                <Link to="/home" className="btn btn-dark custom-btn-back">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="custom-subtitle">📦 Controle de Estoque</h2>
            </header>

            {mensagem.texto && (
                <Alert variant="light" className={mensagem.tipo}>
                    {mensagem.texto}
                </Alert>
            )}

            <Card className="custom-card mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col md={4}>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    value={formData.nome_item}
                                    onChange={e => setFormData({ ...formData, nome_item: e.target.value })}
                                    required
                                />
                            </Col>

                            <Col md={3}>
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select
                                    value={formData.categoria}
                                    onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option>Alimentação</option>
                                    <option>Medicamento</option>
                                    <option>Higiene</option>
                                    <option>Outros</option>
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Label>Qtd</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.quantidade_atual}
                                    onChange={e => setFormData({ ...formData, quantidade_atual: e.target.value })}
                                />
                            </Col>

                            <Col md={3}>
                                <Form.Label>Unidade</Form.Label>
                                <Form.Control
                                    value={formData.unidade_medida}
                                    onChange={e => setFormData({ ...formData, unidade_medida: e.target.value })}
                                />
                            </Col>

                        </Row>

                        <Row className="mt-3">

                            <Col md={3}>
                                <Form.Label>Mínimo</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.quantidade_minima}
                                    onChange={e => setFormData({ ...formData, quantidade_minima: e.target.value })}
                                />
                            </Col>

                            <Col md={3}>
                                <Form.Label>Validade</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.data_validade || ''}
                                    onChange={e => setFormData({ ...formData, data_validade: e.target.value })}
                                />
                            </Col>

                        </Row>

                        <Button type="submit" className="custom-btn mt-3 w-100">
    Salvar
</Button>

                    </Form>
                </Card.Body>
            </Card>

            <Card className="custom-card">
                <Table hover responsive className="text-center">
                    <thead className="bg-pink text-white">
                        <tr>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Qtd</th>
                            <th>Mín</th>
                            <th>Validade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itens.map(i => (
                            <tr key={i.id}>
                                <td>{i.nome_item}</td>
                                <td>{i.categoria}</td>
                                <td>{i.quantidade_atual}</td>
                                <td>{i.quantidade_minima}</td>
                                <td>{i.data_validade ? new Date(i.data_validade).toLocaleDateString() : '-'}</td>
                                <td>
                                    <Button variant="link" onClick={() => editar(i)}>
                                        <Edit size={18}/>
                                    </Button>
                                    <Button variant="link" onClick={() => excluir(i.id)}>
                                        <Trash2 size={18}/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

        </Container>
    );
};

export default GerenciarEstoque;