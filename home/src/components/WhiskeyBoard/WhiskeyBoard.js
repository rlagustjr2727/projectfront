import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import Pagination from "./components/Pagination";
import "./WhiskeyBoard.css";
import images from "./utils/loadImages";

Modal.setAppElement('#root'); // 모달 사용을 위한 기본 설정

function App() {
  const [selectedCategory, setSelectedCategory] = useState({
    whiskey_type: "",
    whiskey_origin: "",
    whiskey_alcohol_type: "",
    whiskey_age: "",
  });
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태 추가
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // 수정 모달 상태 추가
  const [file, setFile] = useState(null); // 파일 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 새로운 상태 추가
  const [newProduct, setNewProduct] = useState({
    whiskey_img: "",
    whiskey_name: "",
    whiskey_info: "",
    whiskey_type: "",
    whiskey_origin: "",
    whiskey_alcohol: "",
    whiskey_tip: "",
    whiskey_age: "",
    whiskey_alcohol_type: "",
  });

  // 수정 상태 추가
  const [editProduct, setEditProduct] = useState({
    whiskey_img: "",
    whiskey_name: "",
    whiskey_info: "",
    whiskey_type: "",
    whiskey_origin: "",
    whiskey_alcohol: "",
    whiskey_tip: "",
    whiskey_age: "",
    whiskey_alcohol_type: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/custom");
        const data = await response.json();
        console.log(data); // 데이터 확인을 위해 로그 추가
        setProducts(data);
        setFilteredItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // 카테고리 선택이 변경될 때마다 첫 페이지로 이동
    setCurrentPage(1);
  }, [selectedCategory]); // 여기에 selectedCategory 추가

  const handleInputChange = (event) => {
    const queryValue = event.target.value;
    setQuery(queryValue);
    setCurrentPage(1);

    const filtered = products.filter((product) =>
      product.whiskey_name.toLowerCase().includes(queryValue.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleCategoryChange = (category, value) => {
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      [category]: value,
    }));
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleEditProductChange = (event) => {
    const { name, value } = event.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      whiskey_img: file.name,
    }));
  };

  const handleEditDrop = (acceptedFiles) => {
  const file = acceptedFiles[0];
  setFile(file);
  setEditProduct((prevProduct) => ({
    ...prevProduct,
    whiskey_img: file.name, // Update whiskey_img in editProduct state
  }));
};


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted"); // 콘솔 로그 추가

    // 중복 이름 검사
    if (products.some((product) => product.whiskey_name === newProduct.whiskey_name)) {
      setErrorMessage("같은 이름의 위스키가 이미 존재합니다.");
      alert("같은 이름의 위스키가 이미 존재합니다.");
      return;
    }
    let uploadedFileName = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {        
        const response = await fetch("http://localhost:8080/api/upload", { // ----------------
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error("File upload failed");
        const data = await response.json();
        uploadedFileName = data.fileName;
        console.log("File uploaded successfully:", uploadedFileName); // 콘솔 로그 추가
      } catch (error) {
        console.error("Error uploading file:", error);  // ----------------
        return;
      }
    }

    const productToAdd = { ...newProduct, whiskey_img: uploadedFileName };
    console.log("Adding product:", productToAdd); // 콘솔 로그 추가
    
    try {
      const response = await fetch("http://localhost:8080/api/addProduct", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd),
      });
      if (!response.ok) throw new Error("Product addition failed");

      const newProductFromServer = await response.json();
      console.log("Product added successfully:", newProductFromServer); // 콘솔 로그 추가

      setProducts([...products, newProductFromServer]);
      setFilteredItems([...products, newProductFromServer]);
      setNewProduct({
        whiskey_img: "",
        whiskey_name: "",
        whiskey_info: "",
        whiskey_type: "",
        whiskey_origin: "",
        whiskey_alcohol: "",
        whiskey_tip: "",
        whiskey_age: "",
        whiskey_alcohol_type: "",
      });
      setModalIsOpen(false); // 모달 닫기
      setErrorMessage(""); // 에러 메시지 초기화
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // 삭제 기능
  const handleDelete = async (whiskeyName, imagePath) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/deleteProduct/${encodeURIComponent(whiskeyName)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageName: imagePath }), // imageName을 전달
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // 삭제 성공 메시지 출력
        alert(data.message);
        // 페이지 새로고침
        window.location.reload();
      } else {
        throw new Error(data.error || "제품 삭제 실패");
      }
    } catch (error) {
      console.error("제품 삭제 오류:", error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalIsOpen(true);
  };



  const handleUpdate = async (event) => {
    event.preventDefault();
  
    try {
      if (!editProduct.whiskey_name) {
        throw new Error("Whiskey name is required for update");
      }
  
      let uploadedFileName = editProduct.whiskey_img; // 기존 파일명 유지
      const formData = new FormData();
  
      if (file) {
        formData.append('file', file);
  
        // 파일 업로드 요청
        const uploadResponse = await fetch("http://localhost:8080/api/upload", {
          method: 'POST',
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }
  
        const uploadData = await uploadResponse.json();
        uploadedFileName = uploadData.fileName;
        console.log("File uploaded successfully:", uploadedFileName);
      }
  
      // 새로운 product 정보 생성
      const updatedProduct = {
        ...editProduct,
        whiskey_img: uploadedFileName,
      };
  
      // 서버로 업데이트 요청
      const updateResponse = await fetch(
        `http://localhost:8080/api/updateProduct/${encodeURIComponent(editProduct.whiskey_name)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
  
      if (!updateResponse.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProductFromServer = await updateResponse.json();
      console.log("Product updated successfully:", updatedProductFromServer);
  
      // 기존 이미지 파일 삭제 처리
      if (editProduct.whiskey_img !== updatedProduct.whiskey_img) {
        const deleteResponse = await fetch(
          `http://localhost:8080/api/deleteImage/${encodeURIComponent(editProduct.whiskey_img)}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
  
        if (!deleteResponse.ok) {
          console.error("Failed to delete old image:", editProduct.whiskey_img);
        } else {
          console.log("Old image deleted successfully:", editProduct.whiskey_img);
        }
      }
  
      // 상태 업데이트
      const updatedProducts = products.map((product) =>
        product.whiskey_name === updatedProductFromServer.whiskey_name ? updatedProductFromServer : product
      );
      setProducts(updatedProducts);
      setFilteredItems(updatedProducts);
      setEditProduct({
        whiskey_img: "",
        whiskey_name: "",
        whiskey_info: "",
        whiskey_type: "",
        whiskey_origin: "",
        whiskey_alcohol: "",
        whiskey_tip: "",
        whiskey_age: "",
        whiskey_alcohol_type: "",
      });
  
      // 모달 닫기
      setEditModalIsOpen(false);
  
      // 성공 메시지 표시
      alert("업데이트 성공!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  
  
  
  

  
  
  
  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function filteredData(products, selectedCategory, query, currentPage, itemsPerPage) {
    let filteredProducts = products;

    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.whiskey_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory.whiskey_type) {
      filteredProducts = filteredProducts.filter(
        (product) => product.whiskey_type === selectedCategory.whiskey_type
      );
    }

    if (selectedCategory.whiskey_origin) {
      filteredProducts = filteredProducts.filter(
        (product) => product.whiskey_origin === selectedCategory.whiskey_origin
      );
    }

    if (selectedCategory.whiskey_alcohol_type) {
      filteredProducts = filteredProducts.filter(
        (product) => product.whiskey_alcohol_type === selectedCategory.whiskey_alcohol_type
      );
    }

    if (selectedCategory.whiskey_age) {
      filteredProducts = filteredProducts.filter(
        (product) => product.whiskey_age === selectedCategory.whiskey_age
      );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return currentItems.map(({ whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip }) => (
      <Card
        key={Math.random()}
        whiskey_img={images[whiskey_img]} // 이미지 경로 설정
        whiskey_name={whiskey_name}
        whiskey_info={whiskey_info}
        whiskey_type={whiskey_type}
        whiskey_origin={whiskey_origin}
        whiskey_alcohol={whiskey_alcohol}
        whiskey_tip={whiskey_tip}
        onDelete={() => handleDelete(whiskey_name, whiskey_img)}
        onUpdate={() => handleEdit({
          whiskey_img,
          whiskey_name,
          whiskey_info,
          whiskey_type,
          whiskey_origin,
          whiskey_alcohol,
          whiskey_tip,
        })}
      />
    ));
  }

  const result = filteredData(products, selectedCategory, query, currentPage, itemsPerPage);

  return (
    <>
      <Navigation
        query={query}
        handleInputChange={handleInputChange}
        openModal={() => setModalIsOpen(true)} // 모달 열기 핸들러 전달
      />
      <Sidebar handleChange={handleCategoryChange} />
      {loading ? (
        <div>Loading...</div>
      ) : error || result.length === 0 ? (
        <div className="message">해당 제품 없음</div>
      ) : (
        <>
          <Products result={result} />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredItems.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)} // 모달 닫기 핸들러
        contentLabel="Add Product"
        style={{
          overlay: {
            zIndex: 1000, // 모달 백그라운드의 z-index 설정
          },
          content: {
            zIndex: 1001, // 모달 콘텐츠의 z-index 설정
          },
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="whiskey_name"
            value={newProduct.whiskey_name}
            onChange={handleNewProductChange}
            placeholder="위스키 이름"
            required 
          />
          <input
            type="text"
            name="whiskey_info"
            value={newProduct.whiskey_info}
            onChange={handleNewProductChange}
            placeholder="위스키 정보"
            required
          />
          <select
            name="whiskey_type"
            value={newProduct.whiskey_type}
            onChange={handleNewProductChange}
          >
            <option value="블랜디드 몰트 위스키">블랜디드 몰트 위스키</option>
            <option value="블랜디드 스카치 위스키">블랜디드 스카치 위스키</option>
            <option value="블랜디드 아이리쉬 위스키">블랜디드 아이리쉬 위스키</option>
            <option value="블렌디드 그레인 위스키">블렌디드 그레인 위스키</option>
            <option value="싱글 그레인 위스키">싱글 그레인 위스키</option>
            <option value="싱글 몰트 위스키">싱글 몰트 위스키</option>
            <option value="라이 위스키">라이 위스키</option>
            <option value="버번 위스키">버번 위스키</option>
            <option value="테네시 위스키">테네시 위스키</option>
            <option value="보드카">보드카</option>
            <option value="데낄라">데낄라</option>
            <option value="리큐르">리큐르</option>
            <option value="꼬냑">꼬냑</option>
            <option value="진">진</option>
            <option value="럼">럼</option>
          </select>
          <select
            name="whiskey_origin"
            value={newProduct.whiskey_origin}
            onChange={handleNewProductChange}
          >
            <option value="네덜란드">네덜란드</option>
            <option value="독일">독일</option>
            <option value="멕시코">멕시코</option>
            <option value="미국">미국</option>
            <option value="스웨덴">스웨덴</option>
            <option value="스코틀랜드">스코틀랜드</option>
            <option value="스페인">스페인</option>
            <option value="아일랜드">아일랜드</option>
            <option value="영국">영국</option>
            <option value="런던">런던</option>
            <option value="이탈리아">이탈리아</option>
            <option value="일본">일본</option>
            <option value="프랑스">프랑스</option>
          </select>
          <input
            type="text"
            name="whiskey_alcohol"
            value={newProduct.whiskey_alcohol}
            onChange={handleNewProductChange}
            placeholder="위스키 도수"
            required
          />
          <select
            name="whiskey_alcohol_type"
            value={newProduct.whiskey_alcohol_type}
            onChange={handleNewProductChange}
          >
            <option value="E">60% 이상</option>
            <option value="D">50% ~ 60%</option>
            <option value="C">40% ~ 50%</option>
            <option value="B">30% ~ 40%</option>
            <option value="A">30% 미만</option>
          </select>
          <input
            type="text"
            name="whiskey_age"
            value={newProduct.whiskey_age}
            onChange={handleNewProductChange}
            placeholder="위스키 년도"
          />
          <input
            type="text"
            name="whiskey_tip"
            value={newProduct.whiskey_tip}
            onChange={handleNewProductChange}
            placeholder="위스키 팁"
            required
          />
          <div>
            <input
              type="text"
              name="whiskey_img"
              value={newProduct.whiskey_img}
              onChange={handleNewProductChange}
              placeholder="위스키 사진"
              required
              readOnly
            />
            <FileDropzone onDrop={handleDrop} />
          </div>
          <div className="button">
            <button type="submit">Add Product</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)} // 모달 닫기 핸들러
        contentLabel="Edit Product"
        style={{
          overlay: {
            zIndex: 1000, // 모달 백그라운드의 z-index 설정
          },
          content: {
            zIndex: 1001, // 모달 콘텐츠의 z-index 설정
          },
        }}
      >
        <form onSubmit={handleUpdate}>
          
          <input
            type="text"
            name="whiskey_info"
            value={editProduct.whiskey_info}
            onChange={handleEditProductChange}
            placeholder="위스키 정보"
            required
          />
          <select
            name="whiskey_type"
            value={editProduct.whiskey_type}
            onChange={handleEditProductChange}
          >
            <option value="블랜디드 몰트 위스키">블랜디드 몰트 위스키</option>
            <option value="블랜디드 스카치 위스키">블랜디드 스카치 위스키</option>
            <option value="블랜디드 아이리쉬 위스키">블랜디드 아이리쉬 위스키</option>
            <option value="블렌디드 그레인 위스키">블렌디드 그레인 위스키</option>
            <option value="싱글 그레인 위스키">싱글 그레인 위스키</option>
            <option value="싱글 몰트 위스키">싱글 몰트 위스키</option>
            <option value="라이 위스키">라이 위스키</option>
            <option value="버번 위스키">버번 위스키</option>
            <option value="테네시 위스키">테네시 위스키</option>
            <option value="보드카">보드카</option>
            <option value="데낄라">데낄라</option>
            <option value="리큐르">리큐르</option>
            <option value="꼬냑">꼬냑</option>
            <option value="진">진</option>
            <option value="럼">럼</option>
          </select>
          <select
            name="whiskey_origin"
            value={editProduct.whiskey_origin}
            onChange={handleEditProductChange}
          >
            <option value="네덜란드">네덜란드</option>
            <option value="독일">독일</option>
            <option value="멕시코">멕시코</option>
            <option value="미국">미국</option>
            <option value="스웨덴">스웨덴</option>
            <option value="스코틀랜드">스코틀랜드</option>
            <option value="스페인">스페인</option>
            <option value="아일랜드">아일랜드</option>
            <option value="영국">영국</option>
            <option value="런던">런던</option>
            <option value="이탈리아">이탈리아</option>
            <option value="일본">일본</option>
            <option value="프랑스">프랑스</option>
          </select>
          <input
            type="text"
            name="whiskey_alcohol"
            value={editProduct.whiskey_alcohol}
            onChange={handleEditProductChange}
            placeholder="위스키 도수"
            required
          />
          <select
            name="whiskey_alcohol_type"
            value={editProduct.whiskey_alcohol_type}
            onChange={handleEditProductChange}
          >
            <option value="E">60% 이상</option>
            <option value="D">50% ~ 60%</option>
            <option value="C">40% ~ 50%</option>
            <option value="B">30% ~ 40%</option>
            <option value="A">30% 미만</option>
          </select>
          <input
            type="text"
            name="whiskey_age"
            value={editProduct.whiskey_age}
            onChange={handleEditProductChange}
            placeholder="위스키 년도"
          />
          <input
            type="text"
            name="whiskey_tip"
            value={editProduct.whiskey_tip}
            onChange={handleEditProductChange}
            placeholder="위스키 팁"
            required
          />
          <div>
            <input
              type="text"
              name="whiskey_img"
              value={editProduct.whiskey_img}
              onChange={handleEditProductChange}
              placeholder="위스키 사진"
              readOnly
            />
            <FileDropzone onDrop={handleDrop} />
          </div>
          <div className="button">
            <button type="submit">Update Product</button>
            <button type="button" onClick={() => setEditModalIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

const FileDropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>이미지를 이곳에 놓거나 클릭해서 선택하시오.</p>
    </div>
  );
};

export default App;
