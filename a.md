## Halo

```

-- 1. Buat Database
CREATE DATABASE akademik;
\c akademik;

-- 2. Buat Tabel Mahasiswa
CREATE TABLE mahasiswa (
    nim VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
    hobi TEXT,
    data_tambahan JSONB,
    ipk DECIMAL(3,2) CHECK (ipk >= 0.00 AND ipk <= 4.00)
);

-- 3. Buat Tabel Dosen
CREATE TABLE dosen (
    nidn VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    keahlian TEXT
);

-- 4. Buat Tabel Mata_Kuliah
CREATE TABLE mata_kuliah (
    kode_mk VARCHAR(10) PRIMARY KEY,
    nama_mk VARCHAR(100) NOT NULL,
    sks INTEGER NOT NULL CHECK (sks > 0),
    nidn VARCHAR(10) NOT NULL,
    FOREIGN KEY (nidn) REFERENCES dosen(nidn) ON DELETE RESTRICT
);

-- 5. Buat Tabel KRS
CREATE TABLE krs (
    id_krs SERIAL PRIMARY KEY,
    nim VARCHAR(10) NOT NULL,
    kode_mk VARCHAR(10) NOT NULL,
    semester INTEGER CHECK (semester BETWEEN 1 AND 14) NOT NULL,
    nilai CHAR(1) CHECK (nilai IN ('A','B','C','D','E','F')),
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE,
    FOREIGN KEY (kode_mk) REFERENCES mata_kuliah(kode_mk) ON DELETE CASCADE,
    UNIQUE(nim, kode_mk, semester) -- Mahasiswa tidak bisa ambil MK sama di semester yang sama
);

-- 6. Buat Index untuk optimasi query
CREATE INDEX idx_krs_nim ON krs(nim);
CREATE INDEX idx_krs_kode_mk ON krs(kode_mk);
CREATE INDEX idx_mahasiswa_ipk ON mahasiswa(ipk);
```