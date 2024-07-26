
import  {  useEffect, useState } from 'react';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import LoadingScreen from './LoadingScreen'; // Correct import
import SectionForm from './components/SectionForm';

import './App.css';

function App() {
  const [title, setTitle] = useState('Smart Wearable Device for Enhancing Safety and Efficiency of Coal Miners');
  const [name, setName] = useState('Jasmine K.1, Sanjith Krishna S.2, Subashini B.3, Swethaa Shree V.4, Rajavarma R.5');
  const [email, setEmail] = useState('1jasmine.k.ece@kct.ac.in, 2sanjithkrishna.22ec@kct.ac.in, 3subashini.19ec@kct.ac.in, 4swethaashree.19ec@kct.ac.in, 5raja.19ec@kct.ac.in');
  const [abstract, setAbstract] = useState('The task of ensuring worker safety in underground coal mines has never been simple. It has always been challenging to ensure worker safety in underground coal mines. Coal miners are seriously injured or killed as a result of numerous fatal and non-fatal accidents all over the world.');
  const [affiliation, setAffiliation] = useState('2,3,4,5 Electronics and Communication Engineering, Kumaraguru College of Technology, Coimbatore, India');
  const [keywords, setKeywords] = useState('Coal Miner Safety, Wearable Device, Sensors, Camera, IIoT');
  const [sections, setSections] = useState([{ 
    title: 'Introduction', 
    content: 'Confidentiality: Only authorised parties should have access to sensitive information.', 
    subheadings: ['Literature Review'], 
    image: null, 
    figure: 'Sample' 
  }]);
  const [references, setReferences] = useState('[1] Maity, T., Das, P. S., & Mukherjee, M. (2011). Rescue and protection system for underground mine workers based on ZigBee. *International Journal of Advanced Computer Engineering and Architecture*, 1, 101-106. Hu, Shushan, Cunchen Tang, Riji Yu, Feng Liu, and Xiaojun Wang. "Intelligent coal mine monitoring system based on the Internet of Things." In 2013 3rd International Conference on Consumer Electronics, Communications and Networks, pp. 380-384. IEEE, 2013.');
  const [docUrl, setDocUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSectionForm, setShowSectionForm] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;



        //useEffect(() => {
        //console.log(...sections)
        //}, [sections]);

  const handleSectionChange = (index, field, value) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
      newSections[index][field] = value;
      return newSections;
    });
  };

  const handleSubheadingChange = (sectionIndex, subheadingIndex, value) => {
    setSections(prevSections => {
      const newSections = [...prevSections];
    newSections[sectionIndex].subheadings[subheadingIndex] = value;
    return newSections
    });
  };

  const handleImageChange = (sectionIndex, event) => {
    const file = event.target.files[0];
    
    if (file) {
       // Store the file object directly
      setSections(prevSections => {
        const newSections = [...prevSections];
      newSections[sectionIndex].image = file;
      return newSections
      });
    }
  };


    

  const addSubheading = (sectionIndex, currentSubheadingLength) => { 
    setSections(prevSections => {
      const newSections = [...prevSections];
      if (newSections[sectionIndex]) newSections[sectionIndex].subheadings[currentSubheadingLength] = "";
      return newSections;
    });

    setShowSectionForm(()=>{
      return <SectionForm 
      section={sections[sectionIndex]} 
      sectionIndex={sectionIndex} 
      handleSectionChange={handleSectionChange} 
      setShowSectionForm={setShowSectionForm}
      handleSubheadingChange={handleSubheadingChange} 
      handleImageChange={handleImageChange}
      addSubheading={addSubheading}
      />
    })
  };



  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setProgress(0); // Reset progress

    const formData = new FormData();
    formData.append('data', JSON.stringify({ title, name, email, abstract, keywords, sections, references, affiliation }));
    sections.forEach((section) => {
      if (section.image) {
        formData.append('images', section.image);
      }
    });

    try {
      const response = await axios.post(`${API_URL}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          // Calculate and set progress percentage
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      setDocUrl(url);

      // Ensure the loading screen is displayed for at least 5 seconds
      setTimeout(() => {
        setLoading(false); // Hide loading screen after 5 seconds
      }, 3000);

    } catch (error) {
      console.error('Error generating document:', error);
      setLoading(false); // Hide loading screen on error
    }
  };


  const removeSection = (sectionIndex) =>{
    setSections(prev => prev.filter((section, index) => index !== sectionIndex))
  }



  const addSection = () => {
    const newSection = { title: '', content: '', subheadings: [], image: null, figure: '' }
    const sectionIndex = sections.length
    setSections(prevSections => {
      const updatedSections = [...prevSections, newSection];
      return updatedSections;
    });
  setShowSectionForm(()=>{
    return <SectionForm section={newSection} sectionIndex={sectionIndex} handleSectionChange={handleSectionChange} 
    setShowSectionForm={setShowSectionForm}
    handleSubheadingChange={handleSubheadingChange} 
    handleImageChange={handleImageChange} addSubheading={addSubheading}
    />
  })
};


  const editSection = (sectionIndex) =>{
    setShowSectionForm(()=>{
      return <SectionForm section={sections[sectionIndex]} sectionIndex={sectionIndex} handleSectionChange={handleSectionChange} 
      setShowSectionForm={setShowSectionForm}
      handleSubheadingChange={handleSubheadingChange} 
      handleImageChange={handleImageChange} addSubheading={addSubheading}
      />
    })
  }

  return (
    <Container className="mt-5">
      {loading && <LoadingScreen progress={progress} />}
      {!loading && (

<>

{showSectionForm }
<div className='container p-4 bg-white'>

<Row>
          <Col>
            <h3 className="text-center mt-3">IRO Journal Paper Format</h3>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label className='Label_'>Title:</Form.Label>
                <Form.Control
                  className='input-tag'
                  type="text"
                  placeholder="Enter title here"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label className='Label_'>Name:</Form.Label>
                <Form.Control
                  className='input-tag'
                  type="text"
                  placeholder="Enter names here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAffiliation" className="mb-3">
                <Form.Label className='Label_'>Author Affiliation:</Form.Label>
                <Form.Control
                  className='input-tag'
                  as="textarea"
                  placeholder="Enter affiliation here"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className='Label_'>Email:</Form.Label>
                <Form.Control
                  className='input-tag'
                  type="text"
                  placeholder="Enter emails here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAbstract" className="mb-3">
                <Form.Label className='Label_'>Abstract:</Form.Label>
                <Form.Control
                  className='input-tag'
                  as="textarea"
                  placeholder="Enter abstract here"
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formKeywords" className="mb-3">
                <Form.Label className='Label_'>Keywords:</Form.Label>
                <Form.Control
                  className='input-tag'
                  type="text"
                  placeholder="Enter keywords here"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </Form.Group>
              
              {/* Sections */}
              <div className='mt-3 mb-5' >
                {sections &&  <Form.Label className='Label_'>Sections:</Form.Label>
                }
              {sections.map((section, sectionIndex) => section.title && 
              <div key={sectionIndex} className='alert alert-primary h5'>{section.title}
              <div onClick={()=> removeSection(sectionIndex)}  style={{float: 'right', cursor: 'pointer'}} ><small>DELETE</small></div>
              <div onClick={()=> editSection(sectionIndex)} className='mx-2' style={{float: 'right', cursor: 'pointer'}} ><small>EDIT</small></div>
              </div>)}
              <Button variant="primary" onClick={addSection}>
                Add Section +
              </Button>
              </div>
              <Form.Group controlId="formReferences" className="mb-3">
                <Form.Label className='Label_'>References:</Form.Label>
                <Form.Control
                  className='input-tag'
                  as="textarea"
                  placeholder="Enter references here"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            {docUrl && (
              <div className="mt-4">
                <a href={docUrl} download="document.docx" className="btn btn-success">
                  Document Download 
                </a>
              </div>
            )}
          </Col>
        </Row>
      </div>
      </>
      )}
    </Container>
  );
}

export default App;
