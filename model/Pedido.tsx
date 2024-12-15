import { Alimento } from "./Alimento";

export class Pedido {
    public id: string;
    public usuarioId: string;
    public estabelecimentos: Array<{
        estabelecimentoId: string;
        itens: Alimento[];
        subtotal: number;
    }>;
    public total: number;
    public status: string;
    public dataCriacao: Date;

    constructor(obj?: Partial<Pedido>) {
        this.id = obj?.id ?? "";
        this.usuarioId = obj?.usuarioId ?? "";
        this.estabelecimentos = obj?.estabelecimentos?.map(est => ({
            estabelecimentoId: est.estabelecimentoId,
            itens: est.itens.map(item => new Alimento(item)),
            subtotal: est.subtotal,
        })) ?? [];
        this.total = obj?.total ?? 0;
        this.status = obj?.status ?? "Pendente";
        this.dataCriacao = obj?.dataCriacao ? new Date(obj.dataCriacao) : new Date();
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
            usuarioId: this.usuarioId,
            estabelecimentos: this.estabelecimentos.map(est => ({
                estabelecimentoId: est.estabelecimentoId,
                itens: est.itens.map(item => item.toFirestore()),
                subtotal: est.subtotal,
            })),
            total: this.total,
            status: this.status,
            dataCriacao: this.dataCriacao.toISOString(),
        }, null, 2);
    }

    toFirestore(): Record<string, any> {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            estabelecimentos: this.estabelecimentos.map(est => ({
                estabelecimentoId: est.estabelecimentoId,
                itens: est.itens.map(item => item.toFirestore()),
                subtotal: est.subtotal,
            })),
            total: this.total,
            status: this.status,
            dataCriacao: this.dataCriacao.toISOString(),
        };
    }

    adicionarItem(estabelecimentoId: string, novoItem: Alimento): void {
        const estabelecimento = this.estabelecimentos.find(est => est.estabelecimentoId === estabelecimentoId);
        if (estabelecimento) {
            const itemIndex = estabelecimento.itens.findIndex(item => item.id === novoItem.id);
            if (itemIndex !== -1) {
                estabelecimento.itens[itemIndex].quantidade += novoItem.quantidade;
            } else {
                estabelecimento.itens.push(novoItem);
            }
            estabelecimento.subtotal += novoItem.preco * novoItem.quantidade;
        } else {
            this.estabelecimentos.push({
                estabelecimentoId,
                itens: [novoItem],
                subtotal: novoItem.preco * novoItem.quantidade,
            });
        }
        this.total += novoItem.preco * novoItem.quantidade;
    }
}
