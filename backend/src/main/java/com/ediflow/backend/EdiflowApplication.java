package com.ediflow.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class EdiflowApplication {

	public static void main(String[] args) {
		SpringApplication.run(EdiflowApplication.class, args);
	}

}
