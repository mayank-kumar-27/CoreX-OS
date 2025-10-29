import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';

function FileSystem() {
  const { fileSystem, createFile, deleteFile, getFilesAtPath } = useAppContext();
  
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('file'); // 'file' or 'directory'
  const [newName, setNewName] = useState('');
  
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    // Load files for current path from global state
    const currentFiles = getFilesAtPath(currentPath);
    setFiles(currentFiles);
  }, [currentPath, fileSystem, getFilesAtPath]);

  const viewFile = (fileName) => {
    const file = files.find(f => f.name === fileName && f.type === 'file');
    if (file) {
      setFileContent(`Content of ${fileName}\n\nThis is a file in CoreX OS Virtual File System.\nSize: ${(file.size / 1024).toFixed(2)} KB\nPath: ${currentPath}/${fileName}`);
      setSelectedFile(fileName);
      setShowFileModal(true);
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      alert('Please enter a name');
      return;
    }

    createFile(currentPath, newName, createType);
    setShowCreateModal(false);
    setNewName('');
  };

  const handleDelete = (fileName) => {
    if (window.confirm(`Delete ${fileName}?`)) {
      deleteFile(currentPath, fileName);
    }
  };

  const navigateUp = () => {
    if (currentPath !== '/') {
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      const newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
      setCurrentPath(newPath);
    }
  };

  const navigateToDir = (dirName) => {
    const newPath = currentPath === '/' ? `/${dirName}` : `${currentPath}/${dirName}`;
    setCurrentPath(newPath);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (type) => {
    return type === 'directory' ? '📁' : '📄';
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      gap: '15px', 
      padding: '15px',
      background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
      overflow: 'hidden'
    }}>
      
      {/* LEFT SECTION - 25% - File Operations & Stats */}
      <div style={{ 
        width: '25%', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflow: 'hidden'
      }}>
        
        {/* File Operations */}
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '15px',
            fontSize: '1.3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📂 File System
          </h2>

          <div style={{ 
            height: '2px', 
            background: 'linear-gradient(90deg, #0F4C75 0%, #3282B8 100%)',
            margin: '12px 0',
            borderRadius: '2px'
          }} />

          <h3 style={{ 
            fontSize: '1rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '10px'
          }}>
            🛠️ Operations
          </h3>

          <Button 
            onClick={() => { setCreateType('file'); setShowCreateModal(true); }}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 15px rgba(50, 130, 184, 0.4)',
              transition: 'all 0.3s',
              marginBottom: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(50, 130, 184, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(50, 130, 184, 0.4)';
            }}
          >
            📄 New File
          </Button>

          <Button 
            onClick={() => { setCreateType('directory'); setShowCreateModal(true); }}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 15px rgba(50, 130, 184, 0.4)',
              transition: 'all 0.3s',
              marginBottom: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(50, 130, 184, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(50, 130, 184, 0.4)';
            }}
          >
            📁 New Directory
          </Button>

          <Button 
            onClick={() => {
              const currentFiles = getFilesAtPath(currentPath);
              setFiles(currentFiles);
            }}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)',
              border: '2px solid #3282B8',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#0F4C75',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #BBE1FA 0%, #3282B8 100%)';
              e.target.style.color = '#0F4C75';
            }}
          >
            🔄 Refresh
          </Button>
        </div>

        {/* File System Stats */}
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          flex: 1,
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            fontSize: '1rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '10px'
          }}>
            📊 Statistics
          </h3>

          <div style={{ fontSize: '0.75rem', color: '#2d3748' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 8px',
                background: 'rgba(187, 225, 250, 0.3)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Total Inodes:</span>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>{fileSystem.stats.total_inodes}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 8px',
                background: 'rgba(187, 225, 250, 0.3)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Used Inodes:</span>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>{fileSystem.stats.used_inodes}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 8px',
                background: 'rgba(187, 225, 250, 0.3)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Total Blocks:</span>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>{fileSystem.stats.total_blocks}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 8px',
                background: 'rgba(187, 225, 250, 0.3)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Used Blocks:</span>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>{fileSystem.stats.used_blocks}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '6px 8px',
                background: 'rgba(187, 225, 250, 0.3)',
                borderRadius: '6px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Block Size:</span>
                <span style={{ color: '#0F4C75', fontWeight: 'bold' }}>{formatSize(fileSystem.stats.block_size)}</span>
              </div>

              <div style={{ 
                marginTop: '10px',
                padding: '8px',
                background: 'rgba(50, 130, 184, 0.1)',
                borderRadius: '8px',
                border: '2px solid #3282B8'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#718096', marginBottom: '3px' }}>
                  Storage Usage
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${(fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) * 100}%`,
                    background: 'linear-gradient(90deg, #3282B8 0%, #0F4C75 100%)',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0F4C75', marginTop: '3px', fontWeight: 'bold' }}>
                  {((fileSystem.stats.used_blocks / fileSystem.stats.total_blocks) * 100).toFixed(1)}% Used
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* RIGHT SECTION - 75% - File Browser */}
      <div style={{ 
        width: '75%', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflow: 'hidden'
      }}>
        
        {/* Current Path & Navigation */}
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button 
              onClick={navigateUp}
              disabled={currentPath === '/'}
              style={{ 
                background: currentPath === '/' 
                  ? '#e2e8f0' 
                  : 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: currentPath === '/' ? '#a0aec0' : 'white',
                cursor: currentPath === '/' ? 'not-allowed' : 'pointer'
              }}
            >
              ⬆️ Up
            </Button>
            
            <div style={{ 
              flex: 1,
              background: 'rgba(187, 225, 250, 0.4)',
              borderRadius: '8px',
              padding: '8px 15px',
              border: '2px solid #3282B8',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#0F4C75',
              fontFamily: 'monospace'
            }}>
              📍 {currentPath}
            </div>
          </div>
        </div>

        {/* File List */}
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(180deg, #ffffff 0%, #BBE1FA 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.2)',
          border: '2px solid rgba(50, 130, 184, 0.3)',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            marginBottom: '15px',
            fontSize: '1.2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0F4C75 0%, #3282B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📂 Directory Contents
          </h3>

          <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
            {files.length === 0 ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontSize: '1rem',
                color: '#718096',
                fontStyle: 'italic'
              }}>
                Empty directory
              </div>
            ) : (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.85rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
                    color: 'white'
                  }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #0F4C75' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #0F4C75', width: '100px' }}>Type</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #0F4C75', width: '100px' }}>Size</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #0F4C75', width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, idx) => (
                    <tr key={idx} style={{ 
                      background: idx % 2 === 0 ? 'rgba(187, 225, 250, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(50, 130, 184, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(187, 225, 250, 0.2)' : 'rgba(255, 255, 255, 0.5)'}
                    >
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #BBE1FA',
                        cursor: file.type === 'directory' ? 'pointer' : 'default',
                        fontWeight: file.type === 'directory' ? 'bold' : 'normal'
                      }}
                      onClick={() => file.type === 'directory' && navigateToDir(file.name)}
                      >
                        {getIcon(file.type)} {file.name}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: file.type === 'directory' ? '#3282B8' : '#718096'
                      }}>
                        {file.type}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'right',
                        fontFamily: 'monospace',
                        color: '#0F4C75'
                      }}>
                        {formatSize(file.size)}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #BBE1FA',
                        textAlign: 'center'
                      }}>
                        {file.type === 'file' && (
                          <Button 
                            onClick={() => viewFile(file.name)}
                            style={{ 
                              background: '#3282B8',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                              color: 'white',
                              marginRight: '5px'
                            }}
                          >
                            👁️ View
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleDelete(file.name)}
                          style={{ 
                            background: '#e53e3e',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            color: 'white'
                          }}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* File View Modal */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} size="lg">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
          color: 'white'
        }}>
          <Modal.Title>📄 {selectedFile}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          background: '#f7fafc',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <pre style={{ 
            background: '#1B262C',
            color: '#BBE1FA',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            margin: 0,
            fontFamily: 'monospace'
          }}>
            {fileContent}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            onClick={() => setShowFileModal(false)}
            style={{ 
              background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
              border: 'none'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create File/Directory Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
          color: 'white'
        }}>
          <Modal.Title>
            {createType === 'file' ? '📄 New File' : '📁 New Directory'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label style={{ fontWeight: 'bold', color: '#2d3748' }}>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={createType === 'file' ? 'filename.txt' : 'directory_name'}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ 
                border: '2px solid #3282B8',
                borderRadius: '8px'
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCreateModal(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            style={{ 
              background: 'linear-gradient(135deg, #3282B8 0%, #0F4C75 100%)',
              border: 'none'
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileSystem;
