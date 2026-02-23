package com.github.bennetttoftner.ranker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class RankerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RankerApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("	<!DOCTYPE html>\r\n" + //
						"    <html>\r\n" + //
						"      <head><title>Hello, %s</title></head>\r\n" + //
						"      <body>\r\n" + //
						"        <h1>Hello from the backend</h1>\r\n" + //
						"      </body>\r\n" + //
						"    </html>", name);
	}

}
