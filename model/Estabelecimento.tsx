export class Estabelecimento{
    public id: string;
    public nome: string;
    public email: string;
    public senha: string;
    public endereco: string;
    public imagem: string;
    public tipo: string;

    constructor(obj?: Partial<Estabelecimento>) {
        if (obj){
            this.id=obj.id
            this.nome=obj.nome
            this.email=obj.email
            this.senha=obj.senha
            this.endereco=obj.endereco
            this.imagem=obj.imagem
            this.tipo=obj.tipo
        }
    }

    toString(){
        const objeto=`{
            "id":       "${this.id}",
            "nome":     "${this.nome}",
            "email":    "${this.email}",
            "senha":    "${this.senha}",
            "endereco":  "${this.endereco}",
            "imagem":   "${this.imagem}",
            "tipo":     "${this.tipo}",
        }`
        return objeto
    }

    toFirestore(){
        const estabelecimento={
            id: this.id,
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            endereco: this.endereco,
            imagem: this.imagem,
            tipo: this.tipo
        }
        return estabelecimento
    }

}