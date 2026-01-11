import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Datos de ejemplo
const companyData = {
  id: 'company_001',
  name: 'TechCorp Solutions',
  address: 'Av. Principal 1234, Santiago, Chile',
  phone: '+56 2 2345 6789',
  email: 'contacto@techcorp.cl',
  website: 'www.techcorp.cl',
  createdAt: new Date()
};

const schedules = [
  {
    id: 'schedule_001',
    name: 'Horario Estándar',
    startTime: '08:30',
    endTime: '17:45',
    tolerance: 15,
    companyId: 'company_001',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'schedule_002',
    name: 'Turno Mañana',
    startTime: '07:00',
    endTime: '15:00',
    tolerance: 10,
    companyId: 'company_001',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'schedule_003',
    name: 'Turno Tarde',
    startTime: '13:00',
    endTime: '21:00',
    tolerance: 15,
    companyId: 'company_001',
    isActive: true,
    createdAt: new Date()
  }
];

const departments = [
  { id: 'dept_001', name: 'Desarrollo', companyId: 'company_001' },
  { id: 'dept_002', name: 'Diseño', companyId: 'company_001' },
  { id: 'dept_003', name: 'Administración', companyId: 'company_001' },
  { id: 'dept_004', name: 'Recursos Humanos', companyId: 'company_001' },
  { id: 'dept_005', name: 'Ventas', companyId: 'company_001' }
];

// Empleados de ejemplo
const employees = [
  {
    email: 'admin@techcorp.cl',
    password: 'admin123',
    userData: {
      displayName: 'Administrador Sistema',
      position: 'Administrador',
      rut: '12.345.678-9',
      department: 'Administración',
      scheduleRef: 'schedule_001',
      role: 'admin',
      companyId: 'company_001',
      isActive: true
    }
  },
  {
    email: 'empleado1@techcorp.cl',
    password: 'empleado123',
    userData: {
      displayName: 'Juan Pérez',
      position: 'Desarrollador Frontend',
      rut: '11.111.111-1',
      department: 'Desarrollo',
      scheduleRef: 'schedule_001',
      role: 'employee',
      companyId: 'company_001',
      isActive: true
    }
  },
  {
    email: 'empleado2@techcorp.cl',
    password: 'empleado123',
    userData: {
      displayName: 'María González',
      position: 'Diseñadora UI/UX',
      rut: '22.222.222-2',
      department: 'Diseño',
      scheduleRef: 'schedule_001',
      role: 'employee',
      companyId: 'company_001',
      isActive: true
    }
  },
  {
    email: 'empleado3@techcorp.cl',
    password: 'empleado123',
    userData: {
      displayName: 'Carlos López',
      position: 'Gerente de Proyecto',
      rut: '33.333.333-3',
      department: 'Administración',
      scheduleRef: 'schedule_001',
      role: 'employee',
      companyId: 'company_001',
      isActive: true
    }
  },
  {
    email: 'empleado4@techcorp.cl',
    password: 'empleado123',
    userData: {
      displayName: 'Ana Rodríguez',
      position: 'Analista de Sistemas',
      rut: '44.444.444-4',
      department: 'Desarrollo',
      scheduleRef: 'schedule_002',
      role: 'employee',
      companyId: 'company_001',
      isActive: true
    }
  },
  {
    email: 'empleado5@techcorp.cl',
    password: 'empleado123',
    userData: {
      displayName: 'Pedro Sánchez',
      position: 'Desarrollador Backend',
      rut: '55.555.555-5',
      department: 'Desarrollo',
      scheduleRef: 'schedule_002',
      role: 'employee',
      companyId: 'company_001',
      isActive: true
    }
  }
];

async function createUserWithData(email, password, userData) {
  try {
    console.log(`Creando usuario: ${email}`);
    
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar perfil
    await updateProfile(user, {
      displayName: userData.displayName
    });
    
    // Crear documento en Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&background=6d28d9&color=fff`,
      position: userData.position,
      rut: userData.rut,
      department: userData.department,
      scheduleRef: userData.scheduleRef,
      role: userData.role,
      companyId: userData.companyId,
      isActive: userData.isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log(`✓ Usuario creado: ${email} (UID: ${user.uid})`);
    
    return user.uid;
  } catch (error) {
    console.error(`✗ Error creando usuario ${email}:`, error.message);
    throw error;
  }
}

async function seedDatabase() {
  console.log('🚀 Iniciando seed de Firebase...\n');
  
  try {
    // 1. Crear compañía
    console.log('📋 Creando compañía...');
    await setDoc(doc(db, 'companies', companyData.id), companyData);
    console.log('✓ Compañía creada:', companyData.name);
    
    // 2. Crear horarios
    console.log('\n📅 Creando horarios...');
    for (const schedule of schedules) {
      await setDoc(doc(db, 'schedules', schedule.id), schedule);
      console.log(`✓ Horario creado: ${schedule.name}`);
    }
    
    // 3. Crear departamentos
    console.log('\n🏢 Creando departamentos...');
    for (const dept of departments) {
      await setDoc(doc(db, 'departments', dept.id), dept);
      console.log(`✓ Departamento creado: ${dept.name}`);
    }
    
    // 4. Crear usuarios/empleados
    console.log('\n👥 Creando usuarios...');
    const userIds = [];
    
    for (const employee of employees) {
      try {
        const uid = await createUserWithData(
          employee.email,
          employee.password,
          employee.userData
        );
        userIds.push(uid);
      } catch (error) {
        // Si el usuario ya existe, continuar
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️ Usuario ya existe: ${employee.email}`);
        }
      }
    }
    
    // 5. Crear registros de asistencia de ejemplo (últimos 7 días)
    console.log('\n🕒 Creando registros de asistencia...');
    const today = new Date();
    
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!userId) continue;
      
      // Crear registros para los últimos 7 días
      for (let day = 6; day >= 0; day--) {
        const recordDate = new Date(today);
        recordDate.setDate(today.getDate() - day);
        
        // Formatear fecha como YYYY-MM-DD
        const dateString = recordDate.toISOString().split('T')[0];
        
        // Determinar si es día laboral (lunes a viernes)
        const dayOfWeek = recordDate.getDay();
        const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
        
        if (isWorkDay && userId !== userIds[0]) { // No crear registros para admin
          // Crear entrada
          const checkInTime = new Date(recordDate);
          checkInTime.setHours(8, 30 + Math.floor(Math.random() * 30), 0); // Entre 8:30 y 9:00
          
          // Crear salida (8-9 horas después)
          const checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(checkInTime.getHours() + 8 + Math.floor(Math.random() * 2));
          checkOutTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * 30));
          
          // Calcular horas trabajadas
          const hoursWorked = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);
          
          // Determinar estado
          const checkInHour = checkInTime.getHours();
          const checkInMinute = checkInTime.getMinutes();
          let status = 'on-time';
          
          if (checkInHour > 8 || (checkInHour === 8 && checkInMinute > 45)) {
            status = 'late';
          }
          
          const attendanceRecord = {
            userId,
            companyId: 'company_001',
            date: dateString,
            checkInTime,
            checkOutTime,
            type: 'password',
            status,
            hoursWorked: parseFloat(hoursWorked),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await addDoc(collection(db, 'attendance'), attendanceRecord);
          console.log(`✓ Registro creado para ${dateString} (Usuario: ${i + 1})`);
        }
      }
    }
    
    console.log('\n✨ Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • Compañía: ${companyData.name}`);
    console.log(`   • Horarios: ${schedules.length}`);
    console.log(`   • Departamentos: ${departments.length}`);
    console.log(`   • Usuarios: ${employees.length}`);
    console.log('\n🔑 Credenciales para testing:');
    console.log('   Admin: admin@techcorp.cl / admin123');
    console.log('   Empleados: empleado1@techcorp.cl / empleado123 (y sucesivos)');
    console.log('\n⚠️  Recuerda configurar las reglas de seguridad en Firebase Console');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seedDatabase();
