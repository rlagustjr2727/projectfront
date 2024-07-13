const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000' // 프론트엔드가 실행되는 도메인
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 오라클 DB 연결 설정
const dbConfig = {
  user: 'soct1',
  password: 'tiger',
  connectString: 'localhost:1521/xe'
};

// 이미지 파일을 저장할 위치
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, 'uploads');
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

// GET 요청 처리
app.get('/api/wboard', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM wboard');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// POST 요청 - 이미지 업로드
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ fileName: req.file.filename });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// POST 요청 - 새로운 제품 추가
app.post('/api/wboard/addProduct', upload.single('file'), async (req, res) => {
  const { wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type } = req.body;
  const wboard_img = req.file ? `/uploads/${req.file.filename}` : null;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const query = `
      INSERT INTO wboard (wboard_img, wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type) 
      VALUES (:wboard_img, :wboard_name, :wboard_info, :wboard_type, :wboard_origin, :wboard_abv, :wboard_tip, :wboard_yo, :wboard_abv_type)
    `;
    await connection.execute(query, [wboard_img, wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type], { autoCommit: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// DELETE 요청 - 제품 삭제
app.delete("/api/wboard/deleteProduct/:wboardname", async (req, res) => {
  const { wboardname } = req.params;
  const { imageName } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const query = 'DELETE FROM wboard WHERE wboard_name = :wboardname';
    const result = await connection.execute(query, [wboardname], { autoCommit: true });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: `${wboardname} 제품을 찾을 수 없습니다` });
    }

    // 이미지 파일 삭제 로직
    if (imageName) {
      const imagePathToDelete = path.join(__dirname, 'uploads', imageName);
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlinkSync(imagePathToDelete);
        console.log(`이미지 파일 ${imagePathToDelete} 삭제 완료`);
      } else {
        console.log(`경로에 해당 이미지 파일이 없습니다: ${imagePathToDelete}`);
      }
    }

    res.json({ success: true, message: `${wboardname} 제품 및 이미지가 성공적으로 삭제되었습니다` });
  } catch (error) {
    console.error('제품 삭제 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// PUT 요청 - 제품 수정
app.put('/api/wboard/updateProduct/:wboardname', upload.single('file'), async (req, res) => {
  const { wboardname } = req.params;
  const updatedProduct = JSON.parse(req.body.wboard);
  const wboard_img = req.file ? `/uploads/${req.file.filename}` : updatedProduct.wboard_img;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const query = `
      UPDATE wboard 
      SET 
        wboard_img = :wboard_img,
        wboard_name = :wboard_name,
        wboard_info = :wboard_info,
        wboard_type = :wboard_type,
        wboard_origin = :wboard_origin,
        wboard_abv = :wboard_abv,
        wboard_tip = :wboard_tip,
        wboard_yo = :wboard_yo,
        wboard_abv_type = :wboard_abv_type
      WHERE wboard_name = :wboardname
    `;
    const { wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type } = updatedProduct;
    const result = await connection.execute(query, [wboard_img, wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type, wboardname], { autoCommit: true });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: `${wboardname} 제품을 찾을 수 없습니다` });
    }

    res.json({ success: true, message: `${wboardname} 제품이 성공적으로 업데이트되었습니다` });
  } catch (error) {
    console.error('제품 업데이트 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// 이미지 삭제 엔드포인트 - 수정시 기존에 있던 이미지 파일 삭제하는 기능
app.delete('/api/wboard/deleteImage/:imageName', (req, res) => {
  const imageName = req.params.imageName;

  // 이미지 파일 경로
  const imagePath = path.join(__dirname, 'uploads', imageName);

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
