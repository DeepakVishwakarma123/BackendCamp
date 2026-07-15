# Project Camp — Self-Challenge Tracker

Rule: instructor's code stays as-is (80%). Yeh checklist tumhara 20% hai — sirf "socho aur decide karo," koi code/logic yahan nahi hai.

## Checklist (course checkpoint → topic)

- [ ] **Schema lecture (Projects/Tasks/Notes)** → Query performance: kaunse fields pe baad mein heavy querying hogi
- [ ] **143-144 (Create/Update/Delete project)** → Cascade/orphan data: project delete pe child data ka kya hoga
- [ ] **143-144** → Soft delete vs hard delete decision
- [ ] **143-144** → Idempotency: duplicate create/update requests
- [ ] **145 (1st aggregation pipeline)** → Query performance revisit: indexes ke bina aggregation slow kyun
- [ ] **147 (Role based permission)** → Apna pehle wala Project↔User role decision practically test karo
- [ ] **148 (Project validators)** → NoSQL injection surface: validation "required" vs "safe input"
- [ ] **149 (Project routes + permissions)** → Rate limiting (checkpoint: security pass)
- [ ] **149** → Testing layer: is chhote module (Projects) ko kaise test karte
- [ ] **149** → Real-time sync: Tasks shuru hone se pehle — kaunsa action isme genuinely value add karega
- [ ] **150-151 (Task controllers + Multer upload)** → File storage scalability: local disk ka limitation
- [ ] **152 (Create/get tasks via populate)** → Concurrent update / race condition (jab status-update controller aaye)
- [ ] **152** → Query performance revisit: task listing pe apna index decision validate karo
- [ ] **153 (Aggregation get task by id)** → No new topic — apna indexing decision yahan confirm karo

## Resource pointers (bas topic name, dhoondhna khud hai)

- Cascade/orphan → "MongoDB referential integrity" / "cascade delete Mongoose"
- Soft delete → "soft delete pattern MongoDB"
- Idempotency → "idempotent API design"
- Indexing → "MongoDB compound index" / "explain() query plan"
- Race condition → "optimistic concurrency control Mongoose versionKey"
- File storage → "why local file storage doesn't scale" / "S3 vs local disk uploads"
- NoSQL injection → "NoSQL injection MongoDB"
- Rate limiting → "express-rate-limit concept"
- Testing → "unit vs integration testing REST API" / "supertest jest basics"
- Real-time → "when to use WebSockets vs REST" (decision framing, not Socket.io syntax)

## Extra features (pick 1-2, not all — this is your "not copy-paste" layer)

- [ ] Activity Log — per-project feed of who-did-what
- [ ] Dashboard/stats endpoint — task counts by status, % complete (aggregation-heavy)
- [ ] Pending invites — add-member flow when the email isn't a registered user yet
- [ ] Pagination + filtering + sorting on task/project listing
- [ ] Task-level comments (separate from project-level Notes)