import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h3>Base-Mãe (Seychelles)</h3>
      <Image
        src="/images/mother-base.png"
        alt="Base-Mãe"
        width={500}
        height={300}
      />
      <p>
        <em>
          Nossa nova Base-Mãe. Não sei quanto tempo vai levar, mas vou torná-la maior e melhor do que antes. ―Kazuhira Miller[src]
        </em>
      </p>
      <br />
      <p>
        A Base-Mãe é a base de operações dos Diamond Dogs, uma unidade mercenária originalmente composta pelos membros sobreviventes dos 
        Militaires Sans Frontières e posteriormente expandida para incluir milhares de pessoas de diversas origens. Assim como a MSF antes deles, 
        a Base-Mãe dos Diamond Dogs é uma instalação offshore composta por várias estruturas conectadas. Ela está localizada perto das Seychelles, 
        na costa leste da África.
      </p>
    </main>
  );
}
