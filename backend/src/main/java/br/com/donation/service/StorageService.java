package br.com.donation.service;

import br.com.donation.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class StorageService {

    // Define a pasta base de uploads na raiz do projeto backend
    private final Path rootLocation = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            // Cria os diretórios se não existirem
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar a pasta de armazenamento", e);
        }
    }

    public String salvarImagem(MultipartFile file, String subfolder) {
        if (file.isEmpty()) {
            throw new BusinessException("Falha ao armazenar arquivo vazio.");
        }

        try {
            Path folderLocation = rootLocation.resolve(subfolder);
            Files.createDirectories(folderLocation);

            // Pega a extensão original do arquivo
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // Gera um nome único para evitar sobrescritas
            String newFilename = UUID.randomUUID().toString() + extension;
            Path destinationFile = folderLocation.resolve(Paths.get(newFilename))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(folderLocation.toAbsolutePath())) {
                // Segurança extra para evitar Path Traversal
                throw new BusinessException("Não é possível armazenar o arquivo fora do diretório atual.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Retorna a URL relativa que será exposta pelo WebConfig
            return "/uploads/" + subfolder + "/" + newFilename;
        } catch (IOException e) {
            throw new BusinessException("Falha ao armazenar a imagem: " + e.getMessage());
        }
    }
}
