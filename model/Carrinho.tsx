import { Alimento } from "./Alimento";

export class Carrinho {
    public id: string;
    public itens: Alimento[];
    public total: number;

    constructor(obj?: Partial<Carrinho>) {
        this.id = obj?.id ?? "";
        this.itens = obj?.itens?.map(item => new Alimento(item)) ?? [];
        this.total = obj?.total ?? 0;
    }

    toString(): string {
        return JSON.stringify({
            id: this.id,
            itens: this.itens.map(item => item.toFirestore()),
            total: this.total,
        }, null, 2);
    }

    toFirestore(): Record<string, any> {
        return {
            id: this.id,
            itens: this.itens.map(item => item.toFirestore()),
            total: this.total,
        };
    }

    adicionarItem(novoItem: Alimento): void {
        this.itens.push(novoItem);
        this.total += novoItem.preco;
    }

    removerItem(itemId: string): void {
        const itemIndex = this.itens.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const [itemRemovido] = this.itens.splice(itemIndex, 1);
            this.total -= itemRemovido.preco;
        }
    }
}