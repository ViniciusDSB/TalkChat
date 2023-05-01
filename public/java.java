import java.util.Scanner;

public class ExemploScanner {
    public static void main(String[] args) {
        // Criar uma instância de Scanner para ler a entrada do usuário
        Scanner scanner = new Scanner(System.in);

        // Ler uma string
        System.out.print("Digite uma string: ");
        String texto = scanner.nextLine();
        System.out.println("Você digitou: " + texto);

        // Ler um número inteiro
        System.out.print("Digite um número inteiro: ");
        int numeroInteiro = scanner.nextInt();
        System.out.println("Você digitou: " + numeroInteiro);

        // Fechar o Scanner
        scanner.close();
    }
}
