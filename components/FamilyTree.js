'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import styles from './FamilyTree.module.css';

export default function FamilyTree() {
    const [familyData, setFamilyData] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const fetchFamilyData = async () => {
        try {
            const res = await fetch('/api/family');
            if (res.ok) {
                const data = await res.json();
                const tree = buildTree(data);
                setFamilyData(tree);
                // Select root by default if available
                if (tree) setSelectedMember(tree);
            }
        } catch (error) {
            console.error('Failed to fetch family tree:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to convert flat list to tree
    const buildTree = (members) => {
        const memberMap = {};
        members.forEach(m => memberMap[m.id] = { ...m, children: [] });

        let root = null;
        members.forEach(m => {
            if (m.parentId && memberMap[m.parentId]) {
                memberMap[m.parentId].children.push(memberMap[m.id]);
            } else {
                root = memberMap[m.id];
            }
        });
        return root;
    };

    if (isLoading) return <div className="p-8 text-center">Loading Family Tree...</div>;
    if (!familyData) return <div className="p-8 text-center">Belum ada data keluarga.</div>;

    return (
        <div className={styles.container}>
            {/* Tree Visualization Area */}
            <div className={styles.treeArea}>
                <div className={styles.treeWrapper}>
                    <TreeNode
                        node={familyData}
                        onSelect={setSelectedMember}
                        level={0}
                    />
                </div>
            </div>

            {/* Detail Sidebar */}
            <div className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Detail Anggota</h3>

                {selectedMember ? (
                    <div className={styles.detailContent}>
                        <div className={styles.avatar}>
                            {selectedMember.photo ? (
                                <img src={selectedMember.photo} alt={selectedMember.name} className={styles.avatarImg} />
                            ) : (
                                <User size={40} />
                            )}
                        </div>

                        <div className={styles.memberInfo}>
                            <h4 className={styles.memberName}>{selectedMember.name}</h4>
                            {selectedMember.spouse && (
                                <p className={styles.memberSpouse}>Pasangan: {selectedMember.spouse}</p>
                            )}
                        </div>

                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Lahir</span>
                                <span>{selectedMember.birthYear || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Wafat</span>
                                <span>{selectedMember.deathYear || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Domisili</span>
                                <span>{selectedMember.location || '-'}</span>
                            </div>
                        </div>

                        <Link href={`/family-tree/${selectedMember.id}`} className={styles.btnOutline}>
                            Lihat Profil Lengkap
                        </Link>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Klik nama pada pohon keluarga untuk melihat detail.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TreeNode({ node, onSelect, level }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className={styles.nodeContainer}>
            {/* Node Card */}
            <div
                className={`${styles.nodeCardWrapper} ${level === 0 ? styles.rootNode : ''} `}
                onClick={() => onSelect(node)}
            >
                <div className={`${styles.nodeCard} ${level === 0 ? styles.rootCard : ''} `}>
                    {/* Tiny Avatar in Node */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mr-2 border border-gray-300">
                        {node.photo ? (
                            <img src={node.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} className="text-gray-400 m-auto" />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <p className={`${styles.nodeName} ${level === 0 ? styles.rootName : ''} `}>
                            {node.name}
                        </p>
                        {node.spouse && (
                            <p className={styles.nodeSpouse}>
                                & {node.spouse}
                            </p>
                        )}
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={styles.toggleBtn}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}
            </div>

            {/* Children Container */}
            {hasChildren && isExpanded && (
                <div className={styles.childrenContainer}>
                    {/* Connecting Lines */}
                    <div className={styles.verticalLine}></div>
                    <div className={styles.horizontalLine}></div>

                    {node.children.map((child) => (
                        <div key={child.id} className={styles.childNodeWrapper}>
                            {/* Vertical line to child */}
                            <div className={styles.childVerticalLine}></div>
                            <TreeNode node={child} onSelect={onSelect} level={level + 1} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
