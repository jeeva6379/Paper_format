
  import { useEffect } from 'react';

  import {  Form, Button } from 'react-bootstrap';


  const SectionForm = ({section, sectionIndex ,handleSectionChange ,handleSubheadingChange ,handleImageChange ,addSubheading, setShowSectionForm}) => 
    {useEffect(() => {
      const handleClick = (e) => {
        if(e.target.classList.contains('section-form-container')) setShowSectionForm(null);
      };
    
      document.addEventListener('click', handleClick);
    
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, []);

    return (
            <div className='section-form-container d-flex justify-content-center align-items-center' style={{overflowY: 'scroll', position: 'fixed', background: '#0006', backdropFilter: 'blur(2px)', inset: '0' , zIndex: '10', }} >

          <div className='bg-white container p-4 rounded shadow my-5 w-100 position-relative'>

            <div onClick={()=> setShowSectionForm(null)} className='close-btn'>&times;</div>

            <Form.Group controlId={`formSectionTitle${sectionIndex}`} className="mb-3">
                      <Form.Label className='Label_'>Section Title:</Form.Label>
                      <Form.Control
                        className='input-tag'
                        type="text"
                        placeholder="Enter section title here"
                        defaultValue={section?.title}
                        onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId={`formSectionContent${sectionIndex}`} className="mb-3">
                      <Form.Label className='Label_'>Section Content:</Form.Label>
                      <Form.Control
                        className='input-tag'
                        as="textarea"
                        placeholder="Enter section content here"
                        defaultValue={section?.content}
                        onChange={(e) => handleSectionChange(sectionIndex, 'content', e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId={`formImageUpload${sectionIndex}`} className="mb-3">
                      <Form.Label className='Label_'>Upload Image:</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(sectionIndex, e)}
                      />
                      {section?.image && <img src={URL.createObjectURL(section?.image)} alt="Uploaded preview" style={{ width: '100px', marginTop: '10px' }} />}
                    </Form.Group>
                    <Form.Group controlId={`formFigure${sectionIndex}`} className="mb-3">
                      <Form.Label className='Label_'>Figure:</Form.Label>
                      <Form.Control
                        className='input-tag'
                        type="text"
                        placeholder="Enter figure here"
                        defaultValue={section?.figure}
                        onChange={(e) => handleSectionChange(sectionIndex, 'figure', e.target.value)}
                      />
                    </Form.Group>
                    {section?.subheadings.map((subheading, subheadingIndex) => (
                      <Form.Group key={subheadingIndex} controlId={`formSubheading${sectionIndex}-${subheadingIndex}`} className="mb-3">
                        <Form.Label className='Label_'>Subheading:</Form.Label>
                        <Form.Control
                          className='input-tag'
                          type="text"
                          placeholder="Enter subheading here"
                          defaultValue={subheading}
                          onChange={(e) => handleSubheadingChange(sectionIndex, subheadingIndex, e.target.value)}
                        />
                      </Form.Group>
                    ))}
                    <a href="#" onClick={()=> addSubheading(sectionIndex, section.subheadings.length)}>
                      Add Subheading
                    </a>
                    <Button  onClick={()=> setShowSectionForm(null)} variant="primary" className='mt-3 d-block mx-auto' style={{width:'120px'}}>
                      Save
                    </Button>
              </div>
                  </div>
    );
  }

  export default SectionForm;
