//server.js
const express = require('express');
const cors = require('cors');
// const mysql = require('mysql2');
const oracledb = require('oracledb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//db연결
const pool = mysql.createPool({
  host: '220.86.29.33',
  user: 'jieun',
  password: 'jieun1234',
  database: 'custom',
  port: 33006,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 이미지 파일을 저장할때 위치 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, '..', 'assets', 'whiskey');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 불러오는 기능
app.get('/api/custom', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM custom');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST upload image
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ fileName: req.file.filename });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// POST add new product
app.post('/api/addProduct', async (req, res) => {
  const { whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type } = req.body;
  try {
    const query = 'INSERT INTO custom (whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await pool.promise().query(query, [whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE 요청을 처리할 엔드포인트
app.delete("/api/deleteProduct/:whiskey_name", async (req, res) => {
  const { whiskey_name } = req.params;
  const { imageName } = req.body; // 클라이언트에서 전달된 imageName

  try {
    // 데이터베이스에서 제품 삭제 로직 (예시)
    const query = 'DELETE FROM custom WHERE whiskey_name = ?';
    const [result] = await pool.promise().query(query, [whiskey_name]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `${whiskey_name} 제품을 찾을 수 없습니다` });
    }
    
    // 이미지 파일 삭제 로직
    if (imageName) {
      const imagePathToDelete = path.join(__dirname, '..', 'assets', 'whiskey', imageName);
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlinkSync(imagePathToDelete);
        console.log(`이미지 파일 ${imagePathToDelete} 삭제 완료`);
      } else {
        console.log(`경로에 해당 이미지 파일이 없습니다: ${imagePathToDelete}`);
      }
    }

    // 성공적으로 삭제되었음을 응답
    res.json({ success: true, message: `${whiskey_name} 제품 및 이미지가 성공적으로 삭제되었습니다` });
  } catch (error) {
    console.error('제품 삭제 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 수정 기능
app.put('/api/updateProduct/:whiskey_name', async (req, res) => {
  const { whiskey_name } = req.params;
  const updatedProduct = req.body;

  try {
    const query = `
      UPDATE custom 
      SET 
        whiskey_img = ?,
        whiskey_name = ?,
        whiskey_info = ?,
        whiskey_type = ?,
        whiskey_origin = ?,
        whiskey_alcohol = ?,
        whiskey_tip = ?,
        whiskey_age = ?,
        whiskey_alcohol_type = ?
      WHERE whiskey_name = ?
    `;
    const { whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type } = updatedProduct;
    const [result] = await pool.promise().query(query, [whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type, whiskey_name]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `${whiskey_name} 제품을 찾을 수 없습니다` });
    }

    res.json({ success: true, message: `${whiskey_name} 제품이 성공적으로 업데이트되었습니다` });
  } catch (error) {
    console.error('제품 업데이트 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 이미지 삭제 엔드포인트 - 수정시 기존에 있던 이미지 파일 삭제하는 기능
app.delete('/api/deleteImage/:imageName', (req, res) => {
  const imageName = req.params.imageName;

  // 이미지 파일 경로
  const imagePath = path.join(__dirname, '..', 'assets', 'whiskey', imageName);

  // 파일 삭제
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Failed to delete image:", err);
      res.status(500).json({ error: "Failed to delete image" });
    } else {
      console.log("Image deleted successfully:", imageName);
      res.json({ message: "Image deleted successfully" });
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
