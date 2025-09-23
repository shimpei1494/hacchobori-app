import { db } from "./db";
import { users, equipments, schedules, todos } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
	try {
		console.log("🌱 Starting database seeding...");

		// Create sample user
		const [sampleUser] = await db
			.insert(users)
			.values({
				name: "Sample User",
				email: "sample@example.com",
				emailVerified: true,
				image: "https://via.placeholder.com/150",
			})
			.returning();

		console.log(`✅ Created user: ${sampleUser.name} (${sampleUser.email})`);

		// Create sample equipment
		const sampleEquipments = [
			{
				name: "Projector A",
				description: "High-resolution projector for presentations",
				category: "AV Equipment",
				status: "available",
				userId: sampleUser.id,
				metadata: { location: "Conference Room A", model: "XYZ-2024" },
			},
			{
				name: "Laptop Cart",
				description: "Mobile cart with 20 laptops",
				category: "Computing",
				status: "available",
				userId: sampleUser.id,
				metadata: { location: "Storage Room", capacity: 20 },
			},
			{
				name: "Sound System",
				description: "Portable sound system with microphones",
				category: "AV Equipment",
				status: "maintenance",
				userId: sampleUser.id,
				metadata: { location: "Auditorium", warranty: "2025-12-31" },
			},
		];

		const createdEquipments = await db
			.insert(equipments)
			.values(sampleEquipments)
			.returning();
		console.log(`✅ Created ${createdEquipments.length} equipment items`);

		// Create sample schedules
		const now = new Date();
		const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const sampleSchedules = [
			{
				title: "Team Meeting",
				description: "Weekly team sync meeting",
				startTime: tomorrow,
				endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
				userId: sampleUser.id,
				equipmentId: createdEquipments[0].id,
				status: "confirmed",
				metadata: { attendees: 10, room: "Conference Room A" },
			},
			{
				title: "Training Session",
				description: "New employee training with laptops",
				startTime: nextWeek,
				endTime: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
				userId: sampleUser.id,
				equipmentId: createdEquipments[1].id,
				status: "scheduled",
				metadata: { attendees: 15, room: "Training Room B" },
			},
		];

		const createdSchedules = await db
			.insert(schedules)
			.values(sampleSchedules)
			.returning();
		console.log(`✅ Created ${createdSchedules.length} schedule items`);

		// Create sample todos
		const sampleTodos = [
			{
				title: "Check projector bulb",
				description: "Verify projector A bulb status and replace if needed",
				completed: false,
				priority: 2,
				dueDate: tomorrow,
				userId: sampleUser.id,
				metadata: { equipmentId: createdEquipments[0].id },
			},
			{
				title: "Update equipment inventory",
				description: "Monthly equipment inventory update",
				completed: false,
				priority: 1,
				dueDate: nextWeek,
				userId: sampleUser.id,
				metadata: { recurring: "monthly" },
			},
			{
				title: "Prepare training materials",
				description:
					"Set up laptops and prepare materials for next week's training",
				completed: true,
				priority: 3,
				userId: sampleUser.id,
				metadata: { scheduleId: createdSchedules[1].id },
			},
		];

		const createdTodos = await db.insert(todos).values(sampleTodos).returning();
		console.log(`✅ Created ${createdTodos.length} todo items`);

		console.log("🎉 Database seeding completed successfully!");

		// Summary
		console.log("\n📋 Seeding Summary:");
		console.log(`  Users: 1`);
		console.log(`  Equipment: ${createdEquipments.length}`);
		console.log(`  Schedules: ${createdSchedules.length}`);
		console.log(`  Todos: ${createdTodos.length}`);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		throw error;
	}
}

// Run seed if this file is executed directly
if (require.main === module) {
	seed()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}

export { seed };
