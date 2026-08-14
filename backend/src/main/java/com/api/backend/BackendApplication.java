package com.api.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	static {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(e -> {
			if (System.getProperty(e.getKey()) == null) {
				System.setProperty(e.getKey(), e.getValue());
			}
		});
	}

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}


}
