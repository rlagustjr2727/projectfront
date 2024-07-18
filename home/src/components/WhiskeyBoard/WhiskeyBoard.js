import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import Pagination from "./components/Pagination";
import "./WhiskeyBoard.css";

Modal.setAppElement('#root');

function App() {
  const [selectedCategory, setSelectedCategory] = useState({
    wboard_type: "",
    wboard_origin: "",
    wboard_abv_type: "",
    wboard_yo: "",
  });
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [newProduct, setNewProduct] = useState({
    wboard_img: "",
    wboard_name: "",
    wboard_info: "",
    wboard_type: "",
    wboard_origin: "",
    wboard_abv: "",
    wboard_tip: "",
    wboard_yo: "",
    wboard_abv_type: "",
  });

  const [editProduct, setEditProduct] = useState({
    wboard_img: "",
    wboard_name: "",
    wboard_info: "",
    wboard_type: "",
    wboard_origin: "",
    wboard_abv: "",
    wboard_tip: "",
    wboard_yo: "",
    wboard_abv_type: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
  
        if (query) {
          params.append('query', query);
        }
  
        if (Array.isArray(selectedCategory.wboard_of_type) && selectedCategory.wboard_of_type.length > 0) {
          params.append('wboard_of_type', JSON.stringify(selectedCategory.wboard_of_type));
        }
  
        if (selectedCategory.wboard_origin) {
          params.append('wboard_origin', selectedCategory.wboard_origin);
        }
  
        if (selectedCategory.wboard_abv_type) {
          params.append('wboard_abv_type', selectedCategory.wboard_abv_type);
        }
  
        if (selectedCategory.wboard_yo) {
          params.append('wboard_yo', selectedCategory.wboard_yo);
        }
  
        const response = await fetch(`http://localhost:8080/api/wboard/filter?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
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
  }, [query, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleInputChange = (event) => {
    const queryValue = event.target.value;
    setQuery(queryValue);
    setCurrentPage(1);
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
      wboard_img: file.name,
    }));
  };

  const handleEditDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      wboard_img: file.name,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    if (products.some((product) => product.wboard_name === newProduct.wboard_name)) {
      setErrorMessage("같은 이름의 위스키가 이미 존재합니다.");
      alert("같은 이름의 위스키가 이미 존재합니다.");
      return;
    }

    const formData = new FormData();
    formData.append('wboard', new Blob([JSON.stringify(newProduct)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch("http://localhost:8080/api/wboard/addProduct", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Product addition failed");

      const newProductFromServer = await response.json();
      console.log("Product added successfully:", newProductFromServer);

      setProducts([...products, newProductFromServer]);
      setFilteredItems([...products, newProductFromServer]);
      setNewProduct({
        wboard_img: "",
        wboard_name: "",
        wboard_info: "",
        wboard_type: "",
        wboard_origin: "",
        wboard_abv: "",
        wboard_tip: "",
        wboard_yo: "",
        wboard_abv_type: "",
      });
      setModalIsOpen(false);
      setErrorMessage("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (productName, imageName) => {
    try {
      const encodedProductName = encodeURIComponent(productName);
      const response = await fetch(`http://localhost:8080/api/wboard/deleteProduct/${encodedProductName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageName })
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const result = await response.json();
      console.log(result.message);

      // 삭제된 제품을 상태에서 제거하여 화면에 반영
      setProducts(prevProducts => prevProducts.filter(product => product.wboard_name !== productName));
      setFilteredItems(prevFilteredItems => prevFilteredItems.filter(product => product.wboard_name !== productName));

      // 알림 표시
      alert('제품이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('제품 삭제 오류:', error);
      alert('제품 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalIsOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
  
    try {
        if (!editProduct.wboard_name) {
            throw new Error("wboard name is required for update");
        }
  
        let uploadedFileName = editProduct.wboard_img;
        const formData = new FormData();
  
        if (file) {
            formData.append('file', file);
  
            const uploadResponse = await fetch("http://localhost:8080/api/upload", {
                method: 'POST',
                body: formData,
            });
  
            if (!uploadResponse.ok) {
                throw new Error("File upload failed");
            }
  
            const uploadData = await uploadResponse.json();
            uploadedFileName = uploadData.fileName; // 이미 경로가 포함되어 있음
            console.log("File uploaded successfully:", uploadedFileName);
        }
  
        const updatedProduct = {
            ...editProduct,
            wboard_img: uploadedFileName,
        };
  
        const updateResponse = await fetch(
            `http://localhost:8080/api/wboard/updateProduct/${encodeURIComponent(editProduct.wboard_name)}`,
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
  
        if (editProduct.wboard_img !== updatedProduct.wboard_img) {
            const deleteResponse = await fetch(
                `http://localhost:8080/api/wboard/deleteImage/${encodeURIComponent(editProduct.wboard_img)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );
  
            if (!deleteResponse.ok) {
                console.error("Failed to delete old image:", editProduct.wboard_img);
            } else {
                console.log("Old image deleted successfully:", editProduct.wboard_img);
            }
        }
  
        const updatedProducts = products.map((product) =>
            product.wboard_name === updatedProductFromServer.wboard_name ? updatedProductFromServer : product
        );
        setProducts(updatedProducts);
        setFilteredItems(updatedProducts);
        setEditProduct({
            wboard_img: "",
            wboard_name: "",
            wboard_info: "",
            wboard_type: "",
            wboard_origin: "",
            wboard_abv: "",
            wboard_tip: "",
            wboard_yo: "",
            wboard_abv_type: "",
        });
  
        setEditModalIsOpen(false);
        alert("업데이트 성공!");
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
    }
};

  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const result = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(({ wboard_img, wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type }) => (
    <Card
      key={Math.random()}
      wboard_img={wboard_img}
      wboard_name={wboard_name}
      wboard_info={wboard_info}
      wboard_type={wboard_type}
      wboard_origin={wboard_origin}
      wboard_abv={wboard_abv}
      wboard_tip={wboard_tip}
      wboard_yo={wboard_yo}
      wboard_abv_type={wboard_abv_type}
      onDelete={() => handleDelete(wboard_name, wboard_img)}
      onUpdate={() => handleEdit({
        wboard_img,
        wboard_name,
        wboard_info,
        wboard_tip,
        wboard_type,
        wboard_origin,
        wboard_abv,
        wboard_yo,
        wboard_abv_type
      })}
    />
  ));

  return (
    <>
      <Navigation
        query={query}
        handleInputChange={handleInputChange}
        openModal={() => setModalIsOpen(true)}
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
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Product"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            zIndex: 1001,
          },
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="wboard_name"
            value={newProduct.wboard_name}
            onChange={handleNewProductChange}
            placeholder="위스키 이름"
            required
          />
          <input
            type="text"
            name="wboard_info"
            value={newProduct.wboard_info}
            onChange={handleNewProductChange}
            placeholder="위스키 정보"
            required
          />
          <select
            name="wboard_type"
            value={newProduct.wboard_type}
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
            name="wboard_origin"
            value={newProduct.wboard_origin}
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
            name="wboard_abv"
            value={newProduct.wboard_abv}
            onChange={handleNewProductChange}
            placeholder="위스키 도수"
            required
          />
          <select
            name="wboard_abv_type"
            value={newProduct.wboard_abv_type}
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
            name="wboard_yo"
            value={newProduct.wboard_yo}
            onChange={handleNewProductChange}
            placeholder="위스키 연산"
          />
          <input
            type="text"
            name="wboard_tip"
            value={newProduct.wboard_tip}
            onChange={handleNewProductChange}
            placeholder="위스키 팁"
            required
          />
          <div>
            <input
              type="text"
              name="wboard_img"
              value={newProduct.wboard_img}
              onChange={handleNewProductChange}
              placeholder="위스키 사진"
              required
              readOnly
            />
            <FileDropzone onDrop={handleDrop} />
          </div>
          <div className="button">
            <button type="submit">위스키 추가</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>취소</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        contentLabel="Edit Product"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            zIndex: 1001,
          },
        }}
      >
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="wboard_info"
            value={editProduct.wboard_info}
            onChange={handleEditProductChange}
            placeholder="위스키 정보"
            required
          />
          <select
            name="wboard_type"
            value={editProduct.wboard_type}
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
            name="wboard_origin"
            value={editProduct.wboard_origin}
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
            name="wboard_abv"
            value={editProduct.wboard_abv}
            onChange={handleEditProductChange}
            placeholder="위스키 도수"
            required
          />
          <select
            name="wboard_abv_type"
            value={editProduct.wboard_abv_type}
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
            name="wboard_yo"
            value={editProduct.wboard_yo}
            onChange={handleEditProductChange}
            placeholder="위스키 년도"
          />
          <input
            type="text"
            name="wboard_tip"
            value={editProduct.wboard_tip}
            onChange={handleEditProductChange}
            placeholder="위스키 팁"
            required
          />
          <div>
            <input
              type="text"
              name="wboard_img"
              value={editProduct.wboard_img}
              onChange={handleEditProductChange}
              placeholder="위스키 사진"
              readOnly
            />
            <FileDropzone onDrop={handleEditDrop} />
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
