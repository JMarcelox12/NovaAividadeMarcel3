export class Alimento{
    public id: string;
    public nome: string;
    public descricao: string;
    public preco: number;
    public imagem: string;
    quantidade: any;

    constructor(obj?: Partial<Alimento>) {
        if (obj){
            this.id=obj.id
            this.nome=obj.nome
            this.descricao=obj.descricao
            this.preco=obj.preco
            this.imagem=obj.imagem
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "descricao": "${this.descricao}",
            "preco":    "${this.preco}",
            "imagem":   "${this.imagem}",
        }`
        return objeto
    }

    toFirestore(){
        const alimento={
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            preco: this.preco,
            imagem: this.imagem
        }
        return alimento
    }

}