// src/mirageServer.js
import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      candidate: Model,
    },

    seeds(server) {
      const stages = ["Applied", "Screening", "Interviewing", "Offer", "Hired"];

      for (let i = 1; i <= 10; i++) {
        server.create("candidate", {
          id: String(i),
          name: `Candidate ${i}`,
          email: `candidate${i}@email.com`,
          stage: stages[i % stages.length],
        });
      }
    },

    routes() {
      this.namespace = "api";

      // GET all candidates
      this.get("/candidates", (schema) => {
        const candidates = schema.candidates.all().models;
        return { candidates };
      });

      // PATCH candidate stage update
      this.patch("/candidates/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const candidate = schema.candidates.find(id);

        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }

        candidate.update(attrs);
        return { candidate };
      });
    },
  });

  return server;
}
